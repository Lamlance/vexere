class DetailElement extends HTMLElement {
    constructor(detail, start, end, form) {
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
        inputs.namedItem("time1").valueAsDate = this.data.startTime;
        inputs.namedItem("time2").valueAsDate = this.data.endTime;
        inputs.namedItem("detailId").valueAsNumber = this.data.id;
        inputs.namedItem("busId").valueAsNumber = this.data.busId;
        inputs.namedItem("from-location").value = `${this.data.Route.startLocId}`;
        inputs.namedItem("to-location").value = `${this.data.Route.endLocId}`;
        inputs.namedItem("seat").valueAsNumber = this.data.remainSeat;
        inputs.namedItem("price").valueAsNumber = this.data.price;
    }
}
customElements.define("detail-element", DetailElement);
export default DetailElement;
