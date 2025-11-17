
export interface Client {
  id: string;
  name: string;
  contact: string;
}

export interface Booking {
  id:string;
  date: string; // YYYY-MM-DD format
  timeSlot: string;
  clientId: string;
}
