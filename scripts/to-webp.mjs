import sharp from "sharp";
import { glob } from "glob";
import { unlink, stat } from "node:fs/promises";

const args = process.argv.slice(2);
const qualityIdx = args.indexOf("--quality");
const quality = qualityIdx !== -1 ? Number(args[qualityIdx + 1]) || 80 : 80;

const files = await glob("src/**/*.{jpg,jpeg,png}", { nocase: true });

let converted = 0;
let skipped = 0;
let failed = 0;
let totalSaved = 0;
const errors = [];

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

for (const file of files) {
  const out = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  try {
    const inputStat = await stat(out);
    if (inputStat.isFile()) {
      skipped++;
      continue;
    }
  } catch {}

  try {
    const inputStat = await stat(file);
    const buffer = await sharp(file).rotate().webp({ quality, effort: 6 }).toBuffer();

    if (buffer.length < inputStat.size) {
      const { writeFile } = await import("node:fs/promises");
      await writeFile(out, buffer);
      const saved = inputStat.size - buffer.length;
      totalSaved += saved;
      console.log(`✓ ${file} → ${out} (${fmt(inputStat.size)} → ${fmt(buffer.length)}, -${fmt(saved)})`);
    } else {
      skipped++;
      console.log(`⊘ ${file} (webp ${fmt(buffer.length)} >= original ${fmt(inputStat.size)}, skipped)`);
      continue;
    }

    await unlink(file);
    converted++;
  } catch (err) {
    failed++;
    errors.push(file);
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\n完成: ${converted} 转换, ${skipped} 跳过, ${failed} 失败`);
console.log(`共节省: ${fmt(totalSaved)}`);
if (errors.length) console.log(`失败文件:\n${errors.map((f) => `  ${f}`).join("\n")}`);
