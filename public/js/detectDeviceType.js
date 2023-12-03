'use strict';

let detectDeviceType = () =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? 'Mobile'
            : 'Desktop';
        console.log(detectDeviceType()); 

    if (detectDeviceType() === 'Desktop'){
        // append Js file to html file :
        const script = document.createElement('script');
        script.src = 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/thumbnail.js';  

        document.head.appendChild(script);

    } else {
        const script = document.createElement('script');
        script.src = 'https://site-regis.s3.eu-west-3.amazonaws.com/public/js/remove_vids.js' //public/js/remove_vids.js';  

        document.head.appendChild(script);
    }