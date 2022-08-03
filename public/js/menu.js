/* 
-- Set & maintain blue color on active <li> --
    - Function blue() adds class "current" on the clicked link
    - Once loading of page is complete
        -> Event Handler "onreadystatechange" / Callback
        -> "readyState" : https://developer.mozilla.org/fr/docs/Web/API/Document/readyState

*/

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



// window.location.href will get your current URL
// You can get the document.URL, but you can not set it. You can both get and set the location.href

const navLinks = [
  "all",
  "animation",
  "aive-action",
  "about"
];


