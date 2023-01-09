"use strict";
function mainAdmin() {
    const selectUL = document.getElementById("admin-tab-select");
    const displayUL = document.getElementById("admin-tab-display");
    if (!selectUL || !displayUL) {
        return;
    }
    const selectTabs = selectUL.querySelectorAll("li:not(.sub-tab-select > li)");
    console.log(selectTabs);
    const displayTab = displayUL.querySelectorAll(".js-tab-display");
    const subUL = selectUL.querySelectorAll(".sub-tab-select");
    selectTabs.forEach((select, selectId) => {
        const subList = select.querySelector(".sub-tab-select");
        select.addEventListener("click", (event) => {
            subUL.forEach((sub) => { sub.style.display = "none"; });
            console.log(subList);
            displayTab.forEach((display, displayId) => {
                display.style.display = (selectId === displayId) ? "block" : "none";
            });
        });
    });
}
mainAdmin();
