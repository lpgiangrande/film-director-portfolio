'use strict';

// Detect device type
const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

document.addEventListener('DOMContentLoaded', () => {
    const deviceType = detectDeviceType();
    console.log(`Device type detected: ${deviceType}`);

    // Determine which script to load based on device type
    const scriptSrc = deviceType === 'Desktop'
        ? '/public/js/thumbnail.js'
        : '/public/js/remove_vids.js';

    console.log(deviceType === 'Desktop'
        ? ">>> Desktop: thumbnail.js loaded <<<"
        : ">>> Mobile: remove_vids.js loaded <<<"
    );

    // Inject the script into the head
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true; // recommended to avoid blocking
    document.head.appendChild(script);
});
