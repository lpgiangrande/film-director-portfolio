/**
 * Turns any Vimeo link into an embeddable player URL.
 *   https://vimeo.com/341833479            -> https://player.vimeo.com/video/341833479
 *   https://vimeo.com/341833479/abc123def  -> https://player.vimeo.com/video/341833479?h=abc123def (unlisted video)
 *   https://player.vimeo.com/video/341833479?... -> unchanged
 * Anything else is returned trimmed, unchanged.
 * Same logic client side in public/js/project-editor.js (toVimeoEmbed).
 */
function toVimeoEmbed(url) {
    const value = (url || '').trim();
    if (!value || value.includes('player.vimeo.com/video/')) return value;

    const match = value.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/([a-z0-9]+))?/i);
    if (!match) return value;

    const [, id, hash] = match;
    return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;
}

export default toVimeoEmbed;
