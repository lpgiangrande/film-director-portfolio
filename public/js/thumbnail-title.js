// alert('works only in desktop');

// Function for titles appearing when hover on bg img
let mouseTarget = document.getElementsByClassName('title');
let targetTitle = document.getElementsByTagName('h3');



for (let i = 0 ; i < mouseTarget.length && i < targetTitle.length; i++) {

    // OVER
    mouseTarget[i].addEventListener('mouseover', show); 
    
    function show(){
        targetTitle[i].style.opacity = "1";  
    }

    // LEAVE
    mouseTarget[i].addEventListener('mouseleave', hide);

    function hide(){
        targetTitle[i].style.opacity = "0"; 
    }

 }

