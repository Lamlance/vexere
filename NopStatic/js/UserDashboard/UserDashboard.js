// main view event Handler
const listItems = document.querySelectorAll(".list-item");
const displayItem = document.querySelectorAll(".sidebar-display-list");
const sidebarNavigation = (document.querySelectorAll(".sidebar-navigation > ul .list-item"));
sidebarNavigation?.forEach((element) => {
    element.addEventListener("click", function () {
        sidebarNavigation.forEach((sidebarNavigation) => {
            sidebarNavigation.classList.remove("active-tab");
        });
        this.classList.add("active-tab");
    });
});
class SidebarDisplayListHandler {
    constructor() {
        this.displayList = (document.querySelectorAll(".sidebar-display > div"));
    }
    setDisplay(index) {
        this.displayList.forEach((item, id) => {
            if (id === index) {
                item.style.display = "block";
            }
            else {
                item.style.display = "none";
            }
        });
    }
}
const sidebarDisplayListHandler = new SidebarDisplayListHandler();
sidebarNavigation?.forEach((item, index) => {
    item.onclick = (ev) => {
        sidebarDisplayListHandler.setDisplay(index);
    };
});
// History Ticket view event Handler
const tabLinks = (document.querySelectorAll(".tab-links"));
tabLinks?.forEach((element) => {
    element.addEventListener("click", function () {
        tabLinks.forEach((tabLinks) => {
            tabLinks.classList.remove("active-tab");
        });
        this.classList.add("active-tab");
    });
});
class TicketTabDisplayHandler {
    constructor() {
        this.contentDisplay = (document.querySelectorAll(".tab-content"));
    }
    setDisplay(index) {
        this.contentDisplay.forEach((item, id) => {
            if (id === index) {
                item.style.display = "block";
            }
            else {
                item.style.display = "none";
            }
        });
    }
}
const ticketTabDisplayHandler = new TicketTabDisplayHandler();
tabLinks?.forEach((item, index) => {
    item.onclick = (ev) => {
        ticketTabDisplayHandler.setDisplay(index);
    };
});
export {};
