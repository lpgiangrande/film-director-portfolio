/*

This js file remove div with video tags (thumbnails) on mobile device

Stop video from loading in background on mobile

*/

const vidsToDelete = document.getElementById('source2');
vidsToDelete.remove();


 
    // get multiple videos
    var sources = document.querySelectorAll('video.no-load-mobile'); 
    // loop through the videos
    sources.forEach(function(source){ 
        // target the src attribute of the <source> element and set it to the data-src attribute
        source.childNodes[1].setAttribute('src', source.childNodes[1].getAttribute('data-src'))
    }); 
