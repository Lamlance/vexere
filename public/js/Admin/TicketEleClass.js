class TicketElement extends HTMLElement {
    constructor(info, form) {
        super();
        this.ticketInfo = info;
        this.ticketForm = form;
        this.innerText = `User id: ${this.ticketInfo.userId}`;
        this.onclick = this.setDataToForm;
    }
    setDataToForm() {
        const inputs = this.ticketForm.elements;
        const comment = inputs.namedItem("comment");
        const status = inputs.namedItem("ticket-status");
        const id = inputs.namedItem("id");
        if (!comment || !status || !id) {
            return;
        }
        comment.value = this.ticketInfo.comment ? this.ticketInfo.comment : "";
        status.value = this.ticketInfo.status;
        id.valueAsNumber = this.ticketInfo.userId;
    }
}
customElements.define('li-ticket-element', TicketElement);
export default TicketElement;
