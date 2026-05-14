import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";

import { BookingFlow } from "@flows/booking.flow";

test.describe("[API][E2E] Complete Booking Workflow", () => {
  test("verify full booking lifecycle: create → read → update → delete", async ({
    bookingApi,
    authToken,
  }) => {
    // Execute complete flow
    const { bookingId, updated } = await BookingFlow.createFullLifecycle(
      bookingApi,
      authToken,
    );

    // Assertions
    expect(bookingId).toBeGreaterThan(0);
    expect(updated.firstname).toBe("Updated");
    expect(updated.lastname).toBe("Name");
    expect(updated.totalprice).toBe(999);
    expect(updated.additionalneeds).toBe("Late checkout + Airport transfer");

    // Final verification: delete
    const deleteResult = await bookingApi.deleteBooking(bookingId, authToken);
    expect(deleteResult.status()).toBe(201);

    const getDeleted = await bookingApi.getBooking(bookingId);
    expect(getDeleted.status()).toBe(404);
  });

  test("verify concurrent creation of multiple bookings", async ({
    bookingApi,
    authToken,
  }) => {
    const booking_1 = TestData.generateValidBookingPayload({
      firstname: "Concurrent1",
      lastname: "User1",
    });
    const booking_2 = TestData.generateValidBookingPayload({
      firstname: "Concurrent2",
      lastname: "User2",
    });

    const [created_1, created_2] = await Promise.all([
      bookingApi.createBooking(booking_1),
      bookingApi.createBooking(booking_2),
    ]);

    const book_1 = await created_1.response.json();
    const book_2 = await created_2.response.json();

    expect(book_1.bookingid).not.toBe(book_2.bookingid);

    // Cleanup
    await Promise.all([
      bookingApi.deleteBooking(book_1.bookingid, authToken),
      bookingApi.deleteBooking(book_2.bookingid, authToken),
    ]);
  });

  test("verify filtering works after creating test data", async ({
    bookingApi,
  }) => {
    const uniqueFirstname = `TestFilter_${Date.now()}`;

    const booking1 = TestData.generateValidBookingPayload({
      firstname: uniqueFirstname,
      lastname: "Smith",
    });
    const booking2 = TestData.generateValidBookingPayload({
      firstname: uniqueFirstname,
      lastname: "Jones",
    });

    const [create1, create2] = await Promise.all([
      bookingApi.createBooking(booking1),
      bookingApi.createBooking(booking2),
    ]);

    const created1 = await create1.response.json();
    const created2 = await create2.response.json();

    // Filter by firstname
    const filterResult = await bookingApi.getBookingIds({
      firstname: uniqueFirstname,
    });

    const bookingIds = await filterResult.json();
    const ids = bookingIds.map((item: any) => item.bookingid);

    expect(
      ids,
      `Should contain booking created with firstname: ${uniqueFirstname}`,
    ).toContain(created1.bookingid);
    expect(ids).toContain(created2.bookingid);
  });
});
