// flows/booking-flow.ts
import { BookingAPI } from "@support/api/booking.api";
import { TestData } from "@utils/testData";

export class BookingFlow {
  static async createFullLifecycle(
    bookingApi: BookingAPI,
    authToken: string,
  ): Promise<{
    bookingId: number;
    original: any;
    updated: any;
  }> {
    // Step 1: Create
    const originalPayload = TestData.generateValidBookingPayload({
      firstname: "E2E",
      lastname: "TestUser",
    });

    const createResult = await bookingApi.createBooking(originalPayload);
    const created = await bookingApi.assertValidCreateBookingResponseSchema(
      createResult.response,
    );

    const bookingId = created.bookingid;

    // Step 2: Update
    const updatedPayload = TestData.generateValidBookingPayload({
      firstname: "Updated",
      lastname: "Name",
      totalprice: 999,
      depositpaid: true,
      additionalneeds: "Late checkout + Airport transfer",
    });

    const updateResult = await bookingApi.updateBooking(
      bookingId,
      updatedPayload,
      authToken,
    );

    const updated = await bookingApi.assertValidBookingSchema(
      await updateResult.json(),
    );

    return {
      bookingId,
      original: created.booking,
      updated: updated,
    };
  }
}
