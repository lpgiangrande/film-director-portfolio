// alert('works only for desktops');


/*

This js file has two purposes :

- 1. Make thumbnails title appear when mouse enter
- 2. Switch thumbnail content from img to video when mouse enter

*/


let mouseTarget = document.getElementsByClassName('title');
let targetTitle = document.getElementsByTagName('h3');
let thumbnail_image = document.querySelectorAll("img.thumbnail_img");

/* TITLES */
for (let i = 0 ; i < mouseTarget.length && i < targetTitle.length && i < thumbnail_image.length ; i++) {

    // OVER
    mouseTarget[i].addEventListener('mouseover', show); 
    
    function show(){
        // 
        
        thumbnail_image[i].style.opacity = "0.5";
        targetTitle[i].style.opacity = "1"; 
        // Replace div img with video

    }

    // LEAVE
    mouseTarget[i].addEventListener('mouseleave', hide);

    function hide(){
        thumbnail_image[i].style.opacity = "1";
        targetTitle[i].style.opacity = "0"; 
        // Replace div video with img
    }

 }


 /* MOUSE ENTER SWITCH CONTENT */

 let thumbnail_container = document.querySelectorAll("div.col-md-4");

 //let thumbnail_video = document.createElement('<video class="thumbnail_vid" controls autoplay src="<%= thumbnail.videoSrc %>" type="video/mp4"></video><video class="thumbnail_vid" controls autoplay src="<%= thumbnail.videoSrc %>" type="video/mp4"></video>');
//let thumbnailImgs = document.querySelector('[class=thumbnail]');
//let videoTag = document.getElementByTagName('video');


for (i = 0; i < thumbnail_container.length; i++){

    // OVER
    thumbnail_container[i].addEventListener('mouseover', switchContent);

    //remove from dom img tag

    function switchContent(){
       //console.log("in")
       //console.log(thumbnail_image[i]);
       //add/replace img tag to dom video tag
    }

    // LEAVE
    thumbnail_container[i].addEventListener('mouseleave', switchBack);

    function switchBack(){
        //console.log("out")

    }
}

