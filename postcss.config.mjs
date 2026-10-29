import postcssImport from 'postcss-import';
import postcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import sortMediaQueries from 'postcss-sort-media-queries';

export default {
    plugins: {
        'postcss-import': postcssImport,
        'tailwindcss/nesting': postcssNesting,
        tailwindcss: tailwindcss,
        'postcss-sort-media-queries': sortMediaQueries({ sort: 'mobile-first' }),
    }
};
