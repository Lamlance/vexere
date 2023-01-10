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

class DetailElement extends HTMLElement {
  private data: RouteDetail;
  private startName: string;
  private endName: string;
  private form: HTMLFormElement;

  constructor(detail: RouteDetail, start: string, end: string, form: HTMLFormElement) {
    super();
    this.data = detail;
    this.startName = start;
    this.endName = end;
    this.form = form;

    this.data.startTime = new Date(this.data.startTime.toLocaleString());
    this.data.endTime = new Date(this.data.endTime.toLocaleString());

    this.innerText = `BusId:${this.data.busId}
      Giờ đi: ${this.data.startTime.toLocaleString('en-GB')}
      Giờ đến: ${this.data.endTime.toLocaleString('en-GB')}
      Tuyến: ${this.startName}->${this.endName}`;

    this.onclick = this.setDataToForm;
  }

  setDataToForm() {
    const inputs = this.form.elements;
    (<HTMLInputElement>inputs.namedItem("time1")).valueAsDate = this.data.startTime;
    (<HTMLInputElement>inputs.namedItem("time2")).valueAsDate = this.data.endTime;
    (<HTMLInputElement>inputs.namedItem("detailId")).valueAsNumber = this.data.id;
    (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber = this.data.busId;
    (<HTMLSelectElement>inputs.namedItem("from-location")).value = `${this.data.Route.startLocId}`;
    (<HTMLSelectElement>inputs.namedItem("to-location")).value = `${this.data.Route.endLocId}`;
  }
}

customElements.define("detail-element", DetailElement);

export default DetailElement;