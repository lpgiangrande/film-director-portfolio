/*

This js file prevents videos from loading on mobile devices

/!\ removing from DOM still loads videos in the background, so :

*/


let videos = document.querySelectorAll('video#no-load-mobile'); 

videos.forEach(function(video){ 

    video.pause();
    video.removeAttribute('src');
    video.load();

   
}); 
