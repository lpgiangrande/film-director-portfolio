function cdnUrl(path) {
    if (!path) return '';

    try {
        const s3Domain = 'site-regis.s3.eu-west-3.amazonaws.com';
        const cdnDomain = 'd1g8vhsh8s80a9.cloudfront.net';

        // Si l'URL contient le domaine S3, on le remplace
        if (path.includes(s3Domain)) {
            return path.replace(`https://${s3Domain}`, `https://${cdnDomain}`);
        }

        // Sinon, on considère que c'est un chemin relatif dans le bucket
        return `https://${cdnDomain}/${path}`;
    } catch (err) {
        console.error('cdnUrl error:', err);
        return path; // fallback
    }
}

export default cdnUrl;
