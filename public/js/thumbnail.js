// alert('works only in desktop');

// Function for titles appearing when hover on bg img
let mouseTarget = document.getElementsByClassName('title');
let targetTitle = document.getElementsByTagName('h3');
let imgTag = document.getElementsByClassName('thumbnail');
//let videoTag = document.getElementByTagName('video');



for (let i = 0 ; i < mouseTarget.length && i < targetTitle.length; i++) {

    // OVER
    mouseTarget[i].addEventListener('mouseover', show); 
    
    function show(){
        targetTitle[i].style.opacity = "1";  
        // Replace div img with video
        //imgTag[i].remove();
        //videoTag[i].style.display = "block";
    }

    // LEAVE
    mouseTarget[i].addEventListener('mouseleave', hide);

    function hide(){
        targetTitle[i].style.opacity = "0"; 
        // Replace div video with img
    }

 }

 for (let j = 0; j < imgTag.length ; j++){
         // OVER
    mouseTarget[i].addEventListener('mouseover', remove); 
    
    function remove(){
        // Replace div img with video
        imgTag[i].remove();
        //videoTag[i].style.display = "block";
    }


 }

