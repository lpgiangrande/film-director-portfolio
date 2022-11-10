// alert('works only for desktops');

/*

This js file has two purposes :

- 1. Remove video tag from DOM on smartphones
- 2. Make thumbnails title appear when mouse enter
- 3. Switch thumbnail content from img to video when mouse enter

*/
'use strict';

const mouseTarget = document.getElementsByClassName('title');
const targetTitle = document.getElementsByTagName('h3');
const thumbnail_img = document.querySelectorAll("img.thumbnail_img");
const thumbnail_vid = document.querySelectorAll("video.thumbnail_vid");


if (detectDeviceType() === 'Mobile'){
// remove video tags for thumbnails :
const thumbnail_vid = document.querySelectorAll("video.thumbnail_vid");
thumbnail_vid.remove();

} 

for (let i = 0 ; i < mouseTarget.length && i < targetTitle.length && i < thumbnail_img.length && i < thumbnail_vid.length; i++) {

    // OVER
    mouseTarget[i].addEventListener('mouseover', show); 
    
    function show(){

        thumbnail_vid[i].style.opacity = "0.5";
        targetTitle[i].style.opacity = "1"; 
        thumbnail_vid[i].style.display = "block";
        thumbnail_img[i].style.display = "none";
    }

    // LEAVE
    mouseTarget[i].addEventListener('mouseleave', hide);

    function hide(){
        thumbnail_img[i].style.opacity = "1";
        targetTitle[i].style.opacity = "0"; 
        thumbnail_vid[i].style.display = "none";
        thumbnail_img[i].style.display = "block";
    }

 }


