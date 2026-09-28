import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client } from '../utils/s3.js';

// Allowed MIME types -> file extension.
// The extension matters: project.ejs checks .endsWith('.jpg') to tell images from videos.
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'video/mp4': 'mp4',
};
const ALLOWED_FOLDERS = ['thumbnails', 'projects', 'about'];

// Presigned URL lifetime (seconds): only the start of the upload must happen within it
const URL_EXPIRES_IN = 600;

/**
 * GET /admin/presign?type=image/jpeg&folder=thumbnails
 * Returns a presigned S3 PUT URL + the public URL the file will have once uploaded.
 */
export const presign = async (req, res) => {
  try {
    const { type, folder } = req.query;

    const ext = ALLOWED_TYPES[type];
    if (!ext) {
      return res.status(400).json({
        error: `Type de fichier non autorisé (${type || 'inconnu'}). Formats acceptés : JPG (image/jpeg) ou MP4 (video/mp4).`,
      });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return res.status(400).json({
        error: `Dossier non autorisé (${folder || 'inconnu'}). Dossiers acceptés : ${ALLOWED_FOLDERS.join(', ')}.`,
      });
    }

    if (!process.env.AWS_REGION || !process.env.S3_BUCKET || !process.env.S3_DOMAIN) {
      console.error('presign: missing AWS_REGION, S3_BUCKET or S3_DOMAIN in .env');
      return res.status(500).json({ error: 'Configuration S3 manquante sur le serveur.' });
    }

    const key = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: type, // the browser must send the same Content-Type header
    });

    const uploadUrl = await getSignedUrl(getS3Client(), command, {
      expiresIn: URL_EXPIRES_IN,
      signableHeaders: new Set(['content-type']), // S3 rejects the PUT if the type differs
    });
    const publicUrl = `https://${process.env.S3_DOMAIN}/${key}`;

    res.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de générer l'URL d'upload." });
  }
};
