const listItems = document.querySelectorAll('.list-item');
const displayItem = document.querySelectorAll('.sidebar-display-list');
const sidebarNavigation = document.querySelector('.sidebar-navigation').querySelectorAll('li');

sidebarNavigation.forEach((element) => {
  element.addEventListener("click", function() {
    sidebarNavigation.forEach((sidebarNavigation) => {
      sidebarNavigation.classList.remove("active-tab") 
    });
    this.classList.add("active-tab");
  });
});



