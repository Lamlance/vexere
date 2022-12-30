import TicketElement from "./TicketEleClass.js";



type Ticket = {
  id: number;
  comment: string | null;
  routeDetailId: number;
  status: "WAITING" | "PAID" | "CANCELED";
  userId: number;
}
class TicketInfo{
  public ticket: Ticket[]
  constructor(){
    this.ticket = [];
  }
  public setTicket(tickets: Ticket[]){
    this.ticket = tickets;
  }
}


const ticketInfo = new TicketInfo();


async function fetchTicket() {
  const ticketForm = <HTMLFormElement> document.getElementById("ticket-display-form");
  const ticketList = <HTMLUListElement> document.getElementById("ticket-display-list");

  if(!ticketForm || !ticketList){
    return;
  }

  console.log("Fetching ticket...")
  const fetchData = await fetch("/admin/api/ticket");
  try {
    const tickets = await fetchData.json();
    console.log(tickets);
    if(!Array.isArray(tickets)){
      return null;
    }
    ticketInfo.ticket = [];
    tickets.forEach((ticket:Ticket)=>{
      ticketInfo.ticket.push(ticket);
    })

    const ticketLi:any[] = [];
    ticketInfo.ticket.forEach(ticket=>{
      const newTicket = new TicketElement(ticket,ticketForm)
      ticketLi.push(newTicket);
    })

    console.log(ticketLi);
    ticketList.replaceChildren(...ticketLi);
    console.log(ticketList);

    return null;
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("ticket-refresh-btn")?.addEventListener("click",fetchTicket);