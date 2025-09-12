'use strict';

let detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

console.log(detectDeviceType());

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

if (detectDeviceType() === 'Desktop') {
    const script = document.createElement('script');
    script.src = isLocal
        ? '/js/thumbnail.js' // version locale pour dev
        : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/thumbnail.js'; // prod
    document.head.appendChild(script);
    console.log(isLocal
        ? ">>> Chargement de thumbnail.js en version locale <<<"
        : ">>> Chargement de thumbnail.js depuis S3 <<<"
    );
} else {
    const script = document.createElement('script');
    script.src = isLocal
        ? '/js/remove_vids.js' // version locale pour dev
        : 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/remove_vids.js'; // prod
    document.head.appendChild(script);
    console.log(isLocal
        ? ">>> Chargement de remove_vids.js en version locale <<<"
        : ">>> Chargement de remove_vids.js depuis S3 <<<"
    );
}
