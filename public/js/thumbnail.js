/*

This js file has two purposes :

- 1. Make thumbnails title appear when mouse enter
- 2. Switch thumbnail content from img to video when mouse enter & video to img on mouse leave

*/
'use strict';

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const mouseTargets = document.querySelectorAll('.title');

mouseTargets.forEach((container) => {
    const title = container.querySelector('h3.thumbnail_title');
    const img = container.querySelector('img.thumbnail_img:not(.fallback)');
    const vid = container.querySelector('video.thumbnail_vid');
    const fallback = container.querySelector('img.thumbnail_img.fallback');

    container.addEventListener('mouseover', () => {
        // Titre toujours visible
        if (title) title.style.opacity = '1';

        if ((isFirefox || isSafari) && fallback) {
            // Pour Firefox/Safari : afficher fallback
            fallback.style.display = 'block';
            if (img) img.style.display = 'none';
            if (vid) vid.style.display = 'none';
        } else if (vid) {
            // Pour Chrome et autres : afficher vidéo
            vid.style.display = 'block';
            if (img) img.style.display = 'none';
            if (fallback) fallback.style.display = 'none';
            vid.play().catch(() => {
                // ignore errors if autoplay blocked
            });
        }
    });

    container.addEventListener('mouseleave', () => {
        // Masquer titre
        if (title) title.style.opacity = '0';

        // Revenir à l'image principale
        if (img) img.style.display = 'block';
        if (vid) vid.style.display = 'none';
        if (fallback) fallback.style.display = 'none';
    });
});