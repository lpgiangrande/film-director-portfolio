function blue() {
    const currentPage = window.location.href;
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        if (link.href == currentPage) {
            //console.log(currentPage);
            link.classList.add("current");
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      blue();
    }
  };



/*let titles = document.querySelectorAll('h3.thumbnail_title'); 

document.onreadystatechange = () => {
    if (document.readyState !="complete") {
        document.querySelector("main").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";

        titles.forEach(function(title){
            title.style.visibility = "hidden";
        })
        
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("main").style.visibility = "visible";

        titles.forEach(function(title){
            title.style.visibility = "visible";
        })

        blue();
    }
};*/

