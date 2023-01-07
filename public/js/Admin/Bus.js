import BusElement from "./BusEle.js";
class BusList {
    constructor() {
        this.busList = [];
    }
    updateBus(bus) {
        for (let index = 0; index < this.busList.length; index++) {
            if (bus.id === this.busList[index].getBusId()) {
                this.busList[index].updateBus({ id: bus.id, plate: bus.plate, seatAmount: bus.seatAmount });
                break;
            }
        }
    }
    addBusElement(ele) {
        this.busList.push(ele);
    }
    clearElement() {
        this.busList = [];
    }
}
const houseMap = {};
const busList = new BusList();
async function fetchBuses() {
    const list = document.getElementById("bus-display-list");
    const form = document.getElementById("bus-display-form");
    const fetchData = await fetch("/admin/api/bus");
    try {
        const buses = await fetchData.json();
        busList.clearElement();
        const liArr = [];
        buses.forEach(bus => {
            const newEle = new BusElement(bus.id, bus.plate, bus.seatAmount, bus.type, bus.busHouse, houseMap[bus.busHouse], form);
            busList.addBusElement(newEle);
            const li = document.createElement("li");
            li.appendChild(newEle);
            liArr.push(li);
        });
        list.replaceChildren(...liArr);
        console.log(buses);
    }
    catch (error) {
        console.log(error);
    }
}
async function addBus(plate, busType, seats, house, form) {
    const ul = document.getElementById("bus-display-list");
    const fetchData = await fetch("/admin/api/bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            plate: plate,
            seatAmount: seats,
            type: house,
            busHouse: house
        })
    });
    try {
        const newBus = await fetchData.json();
        if (newBus) {
            const busEle = new BusElement(newBus.id, newBus.plate, newBus.seatAmount, newBus.type, newBus.busHouse, houseMap[newBus.busHouse], form);
            const li = document.createElement("li");
            li.appendChild(busEle);
            ul.appendChild(li);
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function updateBus(id, plate, type, seats) {
    const fetchData = await fetch("/admin/api/bus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            busId: id,
            plate: plate,
            seatAmount: seats,
            type: type
        })
    });
    try {
        const updateBus = await fetchData.json();
        if (updateBus) {
            busList.updateBus(updateBus);
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function handleBusForm(e) {
    const form = document.getElementById("bus-display-form");
    e.preventDefault();
    const inputs = form.elements;
    const id = inputs.namedItem("busId").valueAsNumber;
    const plate = inputs.namedItem("plate").value;
    const busType = inputs.namedItem("busType").valueAsNumber;
    const seats = inputs.namedItem("seats").valueAsNumber;
    const house = Number.parseInt(inputs.namedItem("house").value);
    if (!plate || isNaN(busType) || isNaN(id)) {
        return;
    }
    if (id < 0) {
        addBus(plate, busType, seats, house, form);
        return;
    }
    updateBus(id, plate, busType, seats);
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
async function addBusBtnHandler() {
    const form = document.getElementById("bus-display-form");
    const inputs = form.elements;
    inputs.namedItem("busId").valueAsNumber = -1;
    inputs.namedItem("plate").value = "";
    inputs.namedItem("busType").valueAsNumber = 1;
    inputs.namedItem("seats").valueAsNumber = 0;
    inputs.namedItem("house").value = "";
}
fetchBusHouses();
document.getElementById("bus-refresh-btn")?.addEventListener("click", fetchBuses);
document.getElementById("bus-display-form")?.addEventListener("submit", handleBusForm);
document.getElementById("bus-add-btn")?.addEventListener("click", addBusBtnHandler);