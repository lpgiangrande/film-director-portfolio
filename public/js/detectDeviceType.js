'use strict';

// Detect local environment
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Detect device type
const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

console.log(detectDeviceType());

// Inject JS based on device
if (detectDeviceType() === 'Desktop') {
    const script = document.createElement('script');
    script.src = isLocal
        ? '/js/thumbnail.js'
        : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/thumbnail.js';
    document.head.appendChild(script);
    console.log(isLocal
        ? ">>> Desktop: thumbnail.js loaded locally <<<"
        : ">>> Desktop: thumbnail.js loaded from S3 <<<"
    );
} else {
    const script = document.createElement('script');
    script.src = isLocal
        ? '/js/remove_vids.js'
        : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/remove_vids.js';
    document.head.appendChild(script);
    console.log(isLocal
        ? ">>> Mobile: remove_vids.js loaded locally <<<"
        : ">>> Mobile: remove_vids.js loaded from S3 <<<"
    );
}
