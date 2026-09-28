import { S3Client } from '@aws-sdk/client-s3';

// Lazy init: ES imports are hoisted, so .env is not loaded yet when this module is evaluated
let s3Client;

export const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      // Recent SDK versions add a CRC32 checksum to presigned URLs by default,
      // which makes browser PUT uploads fail. Only compute it when S3 requires it.
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
  }
  return s3Client;
};
