"use strict";
function BusHouseInfoNavHandler() {
    const navs = document.querySelectorAll(".js_bus_house_info_nav");
    const infoItems = document.querySelectorAll(".js_bus_house_info_item");
    console.log(navs, infoItems);
    infoItems.forEach((infoTab, tabId) => {
        infoTab.style.display = (tabId == 0) ? "" : "none";
    });
    navs.forEach((nav, navId) => {
        nav.addEventListener("click", (event) => {
            infoItems.forEach((infoTab, tabId) => {
                infoTab.style.display = (tabId == navId) ? "" : "none";
            });
        });
    });
}
BusHouseInfoNavHandler();
