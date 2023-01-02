import HouseElement from "./HouseEleClass.js";
class BusHousesInfo {
    constructor() {
        this.houseMap = {};
    }
    addElement(element) {
        this.houseMap[element.getHouse().id] = element;
    }
    updateElement(houseId, houseName) {
        if (this.houseMap[houseId]) {
            this.houseMap[houseId].updateHouseData(houseName);
        }
    }
}
const busHousesInfo = new BusHousesInfo();
async function fetchBusHouse() {
    const houseForm = document.getElementById("house-display-form");
    const houseList = document.getElementById("house-display-list");
    if (!houseForm || !houseList) {
        return;
    }
    console.log("Fetching bus house...");
    const fetchData = await fetch("/admin/api/bushouse");
    try {
        const houses = await fetchData.json();
        console.log(houses);
        if (!Array.isArray(houses)) {
            return null;
        }
        const houseLi = [];
        houses.forEach((house) => {
            const newHouse = new HouseElement(house, houseForm);
            busHousesInfo.addElement(newHouse);
            const li = document.createElement("li");
            li.appendChild(newHouse);
            houseLi.push(li);
        });
        houseList.replaceChildren(...houseLi);
        return;
    }
    catch (error) {
    }
}
async function NewBusHouseClick() {
    const houseForm = document.getElementById("house-display-form");
    const inputs = houseForm.elements;
    inputs.namedItem("house-id").valueAsNumber = -1;
    inputs.namedItem("house-name").value = "";
}
async function createBusHouse(name) {
    const fetchData = await fetch("/admin/api/bushouse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name })
    });
    try {
        const newHouse = await fetchData.json();
        const houseForm = document.getElementById("house-display-form");
        const houseList = document.getElementById("house-display-list");
        const newHouseElement = new HouseElement(newHouse, houseForm);
        const li = document.createElement("li");
        li.appendChild(newHouseElement);
        houseList.appendChild(li);
    }
    catch (error) {
        console.log(error);
    }
}
async function updateBusHouse(id, name) {
    const fetchData = await fetch("/admin/api/bushouse", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ busHouseId: id, name: name })
    });
    try {
        const updatedHouse = await fetchData.json();
        busHousesInfo.updateElement(updatedHouse.id, updatedHouse.Name);
    }
    catch (error) {
        console.log(error);
    }
}
async function BusHouseFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form) {
        return;
    }
    const id = form.elements.namedItem("house-id").valueAsNumber;
    const name = form.elements.namedItem("house-name").value;
    if (isNaN(id) || id < 0) {
        const data = await createBusHouse(name);
        return;
    }
    await updateBusHouse(id, name);
}
document.getElementById("house-refresh-btn")?.addEventListener("click", fetchBusHouse);
document.getElementById("house-add-btn")?.addEventListener("click", NewBusHouseClick);
document.getElementById("house-display-form")?.addEventListener("submit", BusHouseFormSubmit);
