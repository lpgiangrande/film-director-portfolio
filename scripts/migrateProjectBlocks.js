/**
 * Converts projects from the former fixed templates (project.ejs = odd number of visuals,
 * project_v2.ejs = even) to main_video + blocks, reproducing what each page displayed.
 *
 *   node scripts/migrateProjectBlocks.js            -> dry run: prints the result, writes nothing
 *   node scripts/migrateProjectBlocks.js --apply    -> writes main_video + blocks
 *   add --force to also convert projects that already have blocks (overwrites them)
 *
 * Legacy fields are left untouched. Content the old templates did not display is not
 * converted either: it is listed as "hidden" so it can be added back by hand if wanted.
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

const str = (value) => (value || '').trim();

// Blocks helpers
const textBlock = (text) => (str(text) ? [{ type: 'text', text: str(text) }] : []);
const vimeoBlock = (url) => (str(url) ? [{ type: 'vimeo', url: str(url), text: '' }] : []);

// One row with the given visuals, text displayed under it
function rowBlock(urls, text = '') {
    const items = urls.map(str).filter(Boolean).map(url => ({ url, caption: '' }));
    if (!items.length) return textBlock(text);
    return [{ type: 'row', items, text: str(text) }];
}

// The old 4-visual rows were 2 x 2 grids (col-sm-6): two rows of 2, text under the last one
function gridBlocks(urls, text = '') {
    const pairs = [urls.slice(0, 2), urls.slice(2, 4)]
        .map(pair => pair.map(str).filter(Boolean))
        .filter(pair => pair.length);
    if (!pairs.length) return textBlock(text);
    return pairs.flatMap((pair, i) => rowBlock(pair, i === pairs.length - 1 ? text : ''));
}

// views/project.ejs (odd): text after each row, video descriptions not displayed
function convertOdd(p, g, v) {
    return [
        ...rowBlock(g.slice(0, 2), p.gallery_row_1_description),
        ...vimeoBlock(v[1]),
        ...rowBlock(g.slice(2, 5), p.gallery_row_2_description),
        ...vimeoBlock(v[2]),
        ...gridBlocks(g.slice(5, 9), p.gallery_row_3_description),
        ...vimeoBlock(v[3]),
        ...gridBlocks(g.slice(9, 13), p.gallery_row_4_description),
        ...rowBlock(g.slice(13, 16)),
        ...vimeoBlock(v[4]),
        ...vimeoBlock(v[5]),
        ...vimeoBlock(v[6]),
    ];
}

// views/project_v2.ejs (even): texts before rows and videos, videos 5 to 7 not displayed
function convertEven(p, g, v) {
    return [
        ...textBlock(p.gallery_row_1_description),
        ...gridBlocks(g.slice(0, 4)),
        ...textBlock(p.video2_description),
        ...vimeoBlock(v[1]),
        ...textBlock(p.gallery_row_2_description),
        ...gridBlocks(g.slice(4, 8)),
        ...textBlock(p.video3_description),
        ...vimeoBlock(v[2]),
        ...textBlock(p.gallery_row_3_description),
        ...gridBlocks(g.slice(8, 12)),
        ...textBlock(p.gallery_row_4_description),
        ...gridBlocks(g.slice(12, 16)),
        ...textBlock(p.video4_description),
        ...vimeoBlock(v[3]),
    ];
}

// Legacy content that the old template did not show
function hiddenContent(p, g, v, odd) {
    const hidden = [];
    const keys = odd ? [2, 3, 4, 5, 6, 7] : [5, 6, 7];
    keys.forEach(n => { if (str(p[`video${n}_description`])) hidden.push(`texte vidéo ${n}`); });
    if (!odd) v.slice(4).forEach((url, i) => { if (str(url)) hidden.push(`vidéo ${i + 5} (${str(url)})`); });
    if (g.length > 16) hidden.push(`${g.length - 16} visuel(s) au-delà du 16e`);
    return hidden;
}

function convert(p) {
    // The template was chosen on the raw gallery length (empty entries included), keep the same rule
    const g = p.gallery || [];
    const v = p.array_vids || [];
    const odd = g.length % 2 !== 0;
    return {
        template: odd ? 'project' : 'project_v2',
        main_video: str(v[0]),
        blocks: odd ? convertOdd(p, g, v) : convertEven(p, g, v),
        hidden: hiddenContent(p, g, v, odd),
    };
}

const summary = (blocks) => blocks.map(b => (b.type === 'row' ? `row(${b.items.length})` : b.type) + (b.type !== 'text' && b.text ? '+txt' : '')).join(' ');

const client = new MongoClient(str(process.env.MONGODB_URI));
try {
    await client.connect();
    const db = client.db();
    console.log(`Base : ${db.databaseName} — ${APPLY ? 'ÉCRITURE' : 'simulation (ajouter --apply pour écrire)'}\n`);

    const projects = await db.collection('projects').find().toArray();
    let converted = 0;

    for (const p of projects) {
        const label = str(p.project_title).slice(0, 34).padEnd(34);
        if (p.blocks && p.blocks.length && !FORCE) {
            console.log(`${label} déjà converti, ignoré`);
            continue;
        }

        const { template, main_video, blocks, hidden } = convert(p);
        console.log(`${label} [${template}] ${summary(blocks)}`);
        if (hidden.length) console.log(`${''.padEnd(34)} ⚠ non affiché avant, non repris : ${hidden.join(', ')}`);

        if (APPLY) {
            await db.collection('projects').updateOne({ _id: p._id }, { $set: { main_video, blocks } });
        }
        converted++;
    }

    console.log(`\n${converted} projet(s) ${APPLY ? 'convertis' : 'à convertir'}.`);
} finally {
    await client.close();
}
