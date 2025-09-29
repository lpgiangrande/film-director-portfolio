function cdnUrl(path) {
    if (!path) return '';

    try {
        const s3Domain = process.env.S3_DOMAIN;
        const cdnDomain = process.env.CDN_DOMAIN;

        // If the URL contains the S3 domain, replace it
        if (path.includes(s3Domain)) {
            return path.replace(`https://${s3Domain}`, `https://${cdnDomain}`);
        }

        // Otherwise, consider it a relative path in the bucket
        return `https://${cdnDomain}/${path}`;
    } catch (err) {
        console.error('cdnUrl error:', err);
        return path; // fallback
    }
}

export default cdnUrl;
