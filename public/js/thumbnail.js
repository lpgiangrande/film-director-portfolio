// alert('works only for desktops');

/*

This js file has two purposes :

- 1. Make thumbnails title appear when mouse enter
- 2. Switch thumbnail content from img to video when mouse enter & video to img on mouse leave

*/
'use strict';

console.log(">>> thumbnail.js version locale chargée <<<");

const mouseTarget = document.getElementsByClassName('title');
const targetTitle = document.getElementsByTagName('h3');
const thumbnail_img = document.querySelectorAll("img.thumbnail_img");
const thumbnail_vid = document.querySelectorAll("video.thumbnail_vid");


for (let i = 0;
    i < mouseTarget.length
    && i < targetTitle.length
    && i < thumbnail_img.length
    && i < thumbnail_vid.length; i++) {

    mouseTarget[i].addEventListener('mouseover', show);
    mouseTarget[i].addEventListener('mouseleave', hide);

    function show() {
        //thumbnail_vid[i].style.opacity = "0.5";
        targetTitle[i].style.opacity = "1";
        thumbnail_vid[i].style.display = "block";
        thumbnail_img[i].style.display = "none";
    }

    function hide() {
        //thumbnail_img[i].style.opacity = "1";
        targetTitle[i].style.opacity = "0";
        thumbnail_vid[i].style.display = "none";
        thumbnail_img[i].style.display = "block";
    }
}