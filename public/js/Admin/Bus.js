"use strict";
const houseMap = {};
async function fetchBuses() {
    const busList = document.getElementById("bus-display-list");
    const busForm = document.getElementById("bus-display-form");
    const fetchData = await fetch("/admin/api/bus");
    try {
        const buses = await fetchData.json();
        console.log(buses);
    }
    catch (error) {
        console.log(error);
    }
}
async function addBus() {
}
async function handleBusForm(e) {
    const form = document.getElementById("bus-display-form");
    e.preventDefault();
    const inputs = form.elements;
    const id = inputs.namedItem("busId").valueAsNumber;
    const plate = inputs.namedItem("plate").value;
    const busType = inputs.namedItem("busType").valueAsNumber;
    const seats = inputs.namedItem("seats").valueAsNumber;
    if (!plate || isNaN(busType) || isNaN(id)) {
        return;
    }
}
async function fetchBusHouses() {
    const fetchData = await fetch("/admin/api/bushouse");
    try {
        const houses = await fetchData.json();
        console.log(houses);
        const select = document.getElementById("bus-house-select");
        const houseArray = [];
        houses.forEach(house => {
            houseMap[house.id] = house.Name;
            const opt = document.createElement("option");
            opt.value = house.id.toString();
            opt.innerText = house.Name;
            houseArray.push(opt);
        });
        select.replaceChildren(...houseArray);
    }
    catch (error) {
    }
}
fetchBusHouses();
document.getElementById("bus-refresh-btn")?.addEventListener("click", fetchBuses);
document.getElementById("bus-display-form")?.addEventListener("submit", handleBusForm);
