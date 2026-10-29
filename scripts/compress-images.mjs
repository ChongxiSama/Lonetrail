import { readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_CONTENT = join(ROOT, "src/content");
const PUBLIC = join(ROOT, "public");
const WEBP_QUALITY = 80;
const MIN_JPG_SIZE = 100 * 1024;

let totalSaved = 0;
let totalConverted = 0;
let totalSkipped = 0;

async function walkDir(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await walkDir(fullPath)));
      } else {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

async function convertToWebp(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return false;

  const webpPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const inputStat = await stat(inputPath);

  if ([".jpg", ".jpeg"].includes(ext) && inputStat.size < MIN_JPG_SIZE) {
    totalSkipped++;
    return false;
  }

  try {
    const buffer = await readFile(inputPath);
    const webpBuffer = await sharp(buffer).rotate().webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();

    if (ext === ".png" || webpBuffer.length < inputStat.size) {
      await writeFile(webpPath, webpBuffer);
      const saved = inputStat.size - webpBuffer.length;
      totalSaved += Math.max(0, saved);
      totalConverted++;
      console.log(`  ✓ ${inputPath.replace(ROOT + "/", "")} → .webp (${fmt(inputStat.size)} → ${fmt(webpBuffer.length)}, -${fmt(Math.max(0, saved))})`);
      return true;
    } else {
      totalSkipped++;
      return false;
    }
  } catch (err) {
    console.error(`  ✗ ${inputPath.replace(ROOT + "/", "")}: ${err.message}`);
    return false;
  }
}

async function createWebpCopy(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return false;

  const webpPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");
  try { await stat(webpPath); return false; } catch {}

  try {
    const buffer = await readFile(inputPath);
    const inputStat = await stat(inputPath);
    const webpBuffer = await sharp(buffer).rotate().webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
    await writeFile(webpPath, webpBuffer);
    const saved = inputStat.size - webpBuffer.length;
    totalSaved += Math.max(0, saved);
    totalConverted++;
    console.log(`  ✓ ${inputPath.replace(ROOT + "/", "")} → .webp copy (${fmt(inputStat.size)} → ${fmt(webpBuffer.length)})`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${inputPath.replace(ROOT + "/", "")}: ${err.message}`);
    return false;
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  console.log("🖼️  Image Compression Script\n");

  // Phase 1: src/content/ - convert and delete originals
  console.log("═══ Phase 1: src/content/ ═══");
  const srcFiles = await walkDir(SRC_CONTENT);
  const srcImages = srcFiles.filter(f => [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase()));
  console.log(`Found ${srcImages.length} images\n`);

  let phase1 = 0;
  for (const img of srcImages) {
    const ok = await convertToWebp(img);
    if (ok) { await unlink(img); phase1++; }
  }
  console.log(`\nPhase 1: ${phase1} converted, originals deleted\n`);

  // Phase 1b: Update markdown refs in src/content/
  console.log("═══ Updating markdown refs ═══");
  const mdFiles = srcFiles.filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
  let mdUpdated = 0;
  for (const mdFile of mdFiles) {
    let content = await readFile(mdFile, "utf-8");
    let changed = false;
    // Replace .png) and .jpg) in image patterns
    const newContent = content
      .replace(/(\!\[[^\]]*\]\([^)]*\.png)(\))/gi, "$1.webp$2")
      .replace(/(\!\[[^\]]*\]\([^)]*\.jpg)(\))/gi, "$1.webp$2")
      .replace(/(\!\[[^\]]*\]\([^)]*\.jpeg)(\))/gi, "$1.webp$2");
    if (newContent !== content) {
      await writeFile(mdFile, newContent);
      mdUpdated++;
      console.log(`  📝 ${mdFile.replace(ROOT + "/", "")}`);
    }
  }
  console.log(`Updated ${mdUpdated} files\n`);

  // Phase 2: public/ - create WebP copies, keep originals
  console.log("═══ Phase 2: public/ ═══");
  const pubFiles = await walkDir(PUBLIC);
  const pubImages = pubFiles.filter(f => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()));
  console.log(`Found ${pubImages.length} images\n`);

  let phase2 = 0;
  for (const img of pubImages) {
    const ok = await createWebpCopy(img);
    if (ok) phase2++;
  }
  console.log(`\nPhase 2: ${phase2} WebP copies created\n`);

  // Phase 3: Update essay markdown refs for /images/essays/*.jpg
  console.log("═══ Updating essay refs ═══");
  let essayUpdated = 0;
  for (const mdFile of mdFiles) {
    let content = await readFile(mdFile, "utf-8");
    const newContent = content.replace(/\/images\/essays\/([^.]+)\.(jpe?g)/gi, "/images/essays/$1.webp");
    if (newContent !== content) {
      await writeFile(mdFile, newContent);
      essayUpdated++;
      console.log(`  📝 ${mdFile.replace(ROOT + "/", "")}`);
    }
  }
  console.log(`Updated ${essayUpdated} files\n`);

  // Summary
  console.log("═══ Summary ═══");
  console.log(`Converted: ${totalConverted}`);
  console.log(`Skipped: ${totalSkipped}`);
  console.log(`Saved: ${fmt(totalSaved)}`);
}

main().catch(console.error);
