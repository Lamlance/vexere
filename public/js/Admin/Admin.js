"use strict";
function main() {
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
async function fetchTicket() {
    console.log("Fetching ticket...");
    const fetchData = await fetch("/admin/api/ticket");
    try {
        const tickets = await fetchData.json();
        console.log(tickets);
    }
    catch (error) {
        console.log(error);
    }
}
main();
