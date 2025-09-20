'use strict';

// Detect local environment
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

// Detect device type
const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

document.addEventListener('DOMContentLoaded', () => {
    const deviceType = detectDeviceType();
    console.log(`Device type detected: ${deviceType}`);

    let scriptSrc;
    if (deviceType === 'Desktop') {
        scriptSrc = isLocal
            ? '/js/thumbnail.js'
            : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/thumbnail.js';
        console.log(isLocal
            ? ">>> Desktop: thumbnail.js loaded locally <<<"
            : ">>> Desktop: thumbnail.js loaded from S3 <<<"
        );
    } else {
        scriptSrc = isLocal
            ? '/js/remove_vids.js'
            : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/remove_vids.js';
        console.log(isLocal
            ? ">>> Mobile: remove_vids.js loaded locally <<<"
            : ">>> Mobile: remove_vids.js loaded from S3 <<<"
        );
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true; // optionnel mais recommandé
    document.head.appendChild(script);
});
