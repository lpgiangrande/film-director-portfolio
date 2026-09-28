import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getS3Client } from './s3.js';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import Biography from '../models/Biography.js';

/**
 * Deletes from S3 the files of a deleted thumbnail / project, when nothing else on the site uses them.
 * Only called on deletion: updating a project never deletes files (safety net for mistakes).
 * Requires the s3:DeleteObject permission on the bucket for the AWS user of the site.
 */

// Never deleted: site assets (favicon, reference images, former bio photo...)
const PROTECTED_PREFIXES = ['public/'];

const DELETE_BATCH = 1000; // S3 DeleteObjects limit

// Bucket key of a file of ours (S3 or CDN link, or path relative to the bucket as in utils/cdn.js), null otherwise
export function keyFromUrl(url) {
    const value = (url || '').trim();
    if (!value) return null;

    let path = value;
    if (/^https?:\/\//i.test(value)) {
        try {
            const parsed = new URL(value);
            if (![process.env.S3_DOMAIN, process.env.CDN_DOMAIN].includes(parsed.host)) return null;
            path = parsed.pathname;
        } catch (e) {
            return null;
        }
    }

    const key = decodeURIComponent(path.replace(/^\/+/, ''));
    if (!key || PROTECTED_PREFIXES.some(prefix => key.startsWith(prefix))) return null;
    return key;
}

export const thumbnailFiles = (thumbnail) => [thumbnail.imgSrc, thumbnail.videoSrc];

// Visuals of the blocks + legacy gallery (Vimeo links are ignored by keyFromUrl)
export const projectFiles = (project) => [
    ...(project.blocks || []).flatMap(block => (block.items || []).map(item => item.url)),
    ...(project.gallery || []),
];

// Keys of every file still used by the site. Must be called after the database deletion.
async function usedKeys() {
    const [thumbnails, projects, biography] = await Promise.all([
        Thumbnail.find().lean().exec(),
        Project.find().lean().exec(),
        Biography.findOne().lean().exec(),
    ]);
    const urls = [
        ...thumbnails.flatMap(thumbnailFiles),
        ...projects.flatMap(projectFiles),
        biography && biography.pic,
    ];
    return new Set(urls.map(keyFromUrl).filter(Boolean));
}

/**
 * Deletes the given files from S3, except the ones still used elsewhere.
 * Never throws: returns { deleted, failed } so the caller can tell the user.
 */
export async function deleteUnusedFiles(urls) {
    const result = { deleted: 0, failed: 0 };
    try {
        const used = await usedKeys();
        const keys = [...new Set(urls.map(keyFromUrl).filter(Boolean))].filter(key => !used.has(key));

        for (let i = 0; i < keys.length; i += DELETE_BATCH) {
            const batch = keys.slice(i, i + DELETE_BATCH);
            try {
                const response = await getS3Client().send(new DeleteObjectsCommand({
                    Bucket: process.env.S3_BUCKET,
                    Delete: { Objects: batch.map(Key => ({ Key })), Quiet: true }, // Quiet: only errors are returned
                }));
                const errors = response.Errors || [];
                if (errors.length) console.error('S3 delete errors:', errors.map(e => `${e.Key}: ${e.Code}`));
                result.failed += errors.length;
                result.deleted += batch.length - errors.length;
            } catch (err) {
                console.error('S3 delete failed:', err);
                result.failed += batch.length;
            }
        }
    } catch (err) {
        console.error('S3 cleanup failed:', err);
        result.failed += urls.length;
    }
    return result;
}

// Adds the S3 result to the flash messages of the admin list
export function flashS3Result(req, { deleted, failed }) {
    if (failed) {
        req.flash('error_msg', `${failed} fichier(s) n'ont pas pu être supprimés du S3 (droits AWS ?). Ils restent dans le bucket, sans être affichés sur le site.`);
    }
    return deleted ? ` ${deleted} fichier(s) supprimé(s) du S3.` : '';
}
