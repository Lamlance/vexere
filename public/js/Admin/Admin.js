"use strict";
function mainAdmin() {
    const selectUL = document.getElementById("admin-tab-select");
    const displayUL = document.getElementById("admin-tab-display");
    if (!selectUL || !displayUL) {
        return;
    }
    const selectTabs = selectUL.querySelectorAll("li");
    const displayTab = displayUL.querySelectorAll(".js-tab-display");
    selectTabs.forEach((select, selectId) => {
        select.addEventListener("click", () => {
            displayTab.forEach((display, displayId) => {
                display.style.display = (selectId === displayId) ? "block" : "none";
            });
        });
    });
}
mainAdmin();
