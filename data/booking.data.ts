export interface BookingIDs {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface BookingIdResponse {
  bookingid: number;
}

export type GetBookingIdsResponse = BookingIdResponse[];

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingPayload;
}
