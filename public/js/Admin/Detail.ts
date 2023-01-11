import DetailElement from "./DetailEle.js";

type RouteDetail = {
  id: number,
  busId: number,
  price: number,
  endTime: Date,
  startTime: Date
  remainSeat: number
  routeId: number,
  Route: {
    startLocId: number;
    endLocId: number;
  }
}

class DetailInfo{
  public elements:DetailElement[];
  constructor(){
    this.elements = [];
  }
}

const detailInfo = new DetailInfo();

function SwitchGETFrom() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  detailForm.method = "GET";

  const timeLabel = <NodeListOf<HTMLSpanElement>>detailForm.querySelectorAll(".js-time-label > span");
  timeLabel[0].innerText = "Ngày đi sớm nhất";
  timeLabel[1].innerText = "Ngày đi trễ nhất";

  (<HTMLInputElement>detailForm.elements.namedItem("time1")).type = "date";
  (<HTMLInputElement>detailForm.elements.namedItem("time2")).type = "date";
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("busId")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("seat")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("price")).required = false;
  
  const postLabel = <NodeListOf<HTMLLabelElement>>detailForm.querySelectorAll(".js-post-label");
  console.log(postLabel);
  postLabel.forEach(lbl => { lbl.style.display = "none" });
}

function SwitchPOSTForm() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  detailForm.method = "POST";

  const timeLabel = <NodeListOf<HTMLSpanElement>>detailForm.querySelectorAll(".js-time-label > span");
  timeLabel[0].innerText = "Giờ đi";
  timeLabel[1].innerText = "Giờ đến";

  (<HTMLInputElement>detailForm.elements.namedItem("time1")).type = "datetime-local";
  (<HTMLInputElement>detailForm.elements.namedItem("time2")).type = "datetime-local";
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).valueAsNumber = -1;
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("busId")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("seat")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("price")).required = true;

  const postLabel = <NodeListOf<HTMLLabelElement>>detailForm.querySelectorAll(".js-post-label");
  postLabel.forEach(lbl => { lbl.style.display = "grid" });
}

function getFormData() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  const inputs = detailForm.elements;
  const nameIndex =(<HTMLSelectElement>inputs.namedItem("from-location")).selectedIndex;
  const toIndex = (<HTMLSelectElement>inputs.namedItem("to-location")).selectedIndex;
  const data = {
    time1: (<HTMLInputElement>inputs.namedItem("time1")).valueAsDate,
    time2: (<HTMLInputElement>inputs.namedItem("time2")).valueAsDate,
    detailId: (<HTMLInputElement>inputs.namedItem("detailId")).valueAsNumber,
    busId: (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber,
    fromId: Number.parseInt((<HTMLSelectElement>inputs.namedItem("from-location")).value),
    toId: Number.parseInt((<HTMLSelectElement>inputs.namedItem("to-location")).value),
    seat: (<HTMLInputElement>detailForm.elements.namedItem("seat")).valueAsNumber,
    price: (<HTMLInputElement>detailForm.elements.namedItem("price")).valueAsNumber,
    fromName: (<HTMLSelectElement>inputs.namedItem("from-location")).options[nameIndex].text,
    toName : (<HTMLSelectElement>inputs.namedItem("to-location")).options[toIndex].text,
  }
  return data;
}

async function fetchTicket() {
  const data = getFormData();
  const fetchData = await fetch(`/admin/api/route_detail?fromId=${data.fromId}&toId=${data.toId}&time1=${data.time1}&time2=${data.time2}`);
  const routeUL = <HTMLUListElement>document.getElementById("route-display-list");
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");

  try {
    const details:RouteDetail[] = await fetchData.json();
    console.log(details);
    if(detailInfo){
      const liArr:HTMLLIElement[] = [];
      details.forEach((det)=>{
        const newElement = new DetailElement(det,data.fromName,data.toName,detailForm);
        detailInfo.elements.push(newElement);
        const li = document.createElement("li");
        li.appendChild(newElement);
        liArr.push(li);
      })
      routeUL.replaceChildren(...liArr);
    }
  } catch (error) {

  }
}

function handleFormSubmit(e: SubmitEvent) {
  e.preventDefault();
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  switch (detailForm.method) {
    case "get":
    case "GET": {
      console.log("Fetching ticket")
      fetchTicket();
      break;
    }
    case "post":
    case "POST": {
      console.log("Add/Update ticket")
      break;
    }
  }
}

document.getElementById("route-detail-find")?.addEventListener("click", SwitchGETFrom);
document.getElementById("route-detail-add")?.addEventListener("click", SwitchPOSTForm);
document.getElementById("route-detail-form")?.addEventListener("submit", handleFormSubmit);