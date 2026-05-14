import { faker } from "@faker-js/faker";
import { BookingDates, BookingPayload } from "@data/booking.data";
import { PRICE_RANGES } from "@data/prices.data";

export class TestData {
  static formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  static generateBookingDates(): BookingDates {
    const checkInDate = faker.date.soon({ days: 90 });
    const checkOutDate = faker.date.soon({ days: 14, refDate: checkInDate });

    return {
      checkin: this.formatDate(checkInDate),
      checkout: this.formatDate(checkOutDate),
    };
  }

  static generateValidBookingPayload(
    overrides?: Partial<BookingPayload>,
  ): BookingPayload {
    const bookingDates = this.generateBookingDates();

    const basePayload: BookingPayload = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({
        min: PRICE_RANGES.MIN,
        max: PRICE_RANGES.MAX,
      }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: bookingDates,
    };

    const payload = {
      ...basePayload,
      ...overrides,
    };

    if (payload.additionalneeds === undefined) {
      delete payload.additionalneeds;
    }

    return payload;
  }

  static generateBookingWithPrice(
    price: number,
    overrides?: Partial<BookingPayload>,
  ): BookingPayload {
    return this.generateValidBookingPayload({
      totalprice: price,
      ...overrides,
    });
  }
}
