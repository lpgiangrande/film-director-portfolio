import toVimeoEmbed from './vimeo.js';
import { MAX_ITEMS_PER_ROW } from '../models/Project.js';

const MAX_BLOCKS = 60;

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

// Only S3/CDN links produced by the uploader: https + .jpg or .mp4 (project.ejs relies on the extension)
const isMediaUrl = (url) => /^https:\/\/\S+\.(jpg|mp4)$/i.test(url);

/**
 * Parses and cleans the blocks sent by the project form (JSON string in req.body.blocks).
 * Unknown types, empty blocks and invalid links are dropped rather than rejected,
 * so a half-filled block never prevents the client from saving.
 */
function parseBlocks(raw) {
    let input;
    try {
        input = JSON.parse(raw || '[]');
    } catch (e) {
        throw new Error('Invalid blocks JSON');
    }
    if (!Array.isArray(input)) throw new Error('Invalid blocks JSON');

    const blocks = [];

    for (const block of input.slice(0, MAX_BLOCKS)) {
        if (!block || typeof block !== 'object') continue;
        const text = cleanText(block.text);

        if (block.type === 'row') {
            const items = (Array.isArray(block.items) ? block.items : [])
                .map(item => ({ url: cleanText(item && item.url), caption: cleanText(item && item.caption) }))
                .filter(item => isMediaUrl(item.url))
                .slice(0, MAX_ITEMS_PER_ROW);
            if (items.length) blocks.push({ type: 'row', items, text });
            else if (text) blocks.push({ type: 'text', text });
        } else if (block.type === 'vimeo') {
            const url = toVimeoEmbed(block.url);
            if (url.startsWith('https://')) blocks.push({ type: 'vimeo', url, text });
            else if (text) blocks.push({ type: 'text', text });
        } else if (block.type === 'text') {
            if (text) blocks.push({ type: 'text', text });
        }
    }

    return blocks;
}

export default parseBlocks;
