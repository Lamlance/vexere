import BusElement from "./BusEle";

interface GetBusesRespond {
  id: number,
  plate: string
  seatAmount: number
  type: number
  busHouse: number,
  BusHouse: {
    Name: string;
  }
}

type Bus = {
  id: number
  plate: string
  seatAmount: number
  type: number
  busHouse: number
}
class BusList{
  private busList:BusElement[] = [];
  constructor(){}
}

const houseMap: { [key: number]: string } = {}


async function fetchBuses() {
  const busList = <HTMLUListElement>document.getElementById("bus-display-list");
  const busForm = <HTMLFormElement>document.getElementById("bus-display-form");
  const fetchData = await fetch("/admin/api/bus");
  try {
    const buses: GetBusesRespond[] = await fetchData.json();
    console.log(buses);
  } catch (error) { console.log(error) }
}

async function addBus(plate: string, busType: number, seats: number, house: number, form: HTMLFormElement) {
  const ul = <HTMLUListElement>document.getElementById("bus-display-list");
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
    const newBus: Bus = await fetchData.json();
    if (newBus) {
      const busEle = new BusElement(newBus.id, newBus.plate, newBus.seatAmount, newBus.type, newBus.busHouse, houseMap[newBus.busHouse], form);
      ul.appendChild(busEle);
    }
  } catch (error) { console.log(error) }
}

async function updateBus(id: number, plate: string, type: number, seats: number) {
  const fetchData = await fetch("/admin/api/bus", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      busId: id,
      plate: plate,
      seatAmount: seats,
      type: type
    })
  })

  try {
    const updateBus:Bus = await fetchData.json();

  } catch (error) {console.log(error)}
}

async function handleBusForm(e: SubmitEvent) {
  const form = <HTMLFormElement>document.getElementById("bus-display-form");
  e.preventDefault();
  const inputs = form.elements;
  const id = (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber;
  const plate = (<HTMLInputElement>inputs.namedItem("plate")).value;
  const busType = (<HTMLInputElement>inputs.namedItem("busType")).valueAsNumber;
  const seats = (<HTMLInputElement>inputs.namedItem("seats")).valueAsNumber;
  const house = Number.parseInt((<HTMLSelectElement>document.getElementById("house")).value);

  if (!plate || isNaN(busType) || isNaN(id)) {
    return;
  }

  if (id < 0) {
    fetchBuses();
    return;
  }

}

async function fetchBusHouses() {
  const fetchData = await fetch("/admin/api/bushouse");
  try {
    const houses: { id: number, Name: string }[] = await fetchData.json();
    console.log(houses);
    const select = (<HTMLSelectElement>document.getElementById("bus-house-select"));
    const houseArray: (HTMLOptionElement[]) = [];
    houses.forEach(house => {
      houseMap[house.id] = house.Name;
      const opt = document.createElement("option");
      opt.value = house.id.toString();
      opt.innerText = house.Name
      houseArray.push(opt);
    })
    select.replaceChildren(...houseArray);
  } catch (error) {

  }
}
fetchBusHouses();
document.getElementById("bus-refresh-btn")?.addEventListener("click", fetchBuses);
document.getElementById("bus-display-form")?.addEventListener("submit", handleBusForm);