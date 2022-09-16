// alert('works only for desktops');

/*

This js file has two purposes :

- 1. Make thumbnails title appear when mouse enter
- 2. Switch thumbnail content from img to video when mouse enter

*/


let mouseTarget = document.getElementsByClassName('title');
let targetTitle = document.getElementsByTagName('h3');
let thumbnail_img = document.querySelectorAll("img.thumbnail_img");
let thumbnail_vid = document.querySelectorAll("video.thumbnail_vid");


for (let i = 0 ; i < mouseTarget.length && i < targetTitle.length && i < thumbnail_img.length && thumbnail_vid.length; i++) {
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



