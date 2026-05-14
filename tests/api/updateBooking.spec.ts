import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";
import { authData } from "@data/auth.data";

test.describe("[API][UPDATE] Booking API - UpdateBooking", () => {
  let testBookingId: number;

  test.beforeEach(async ({ bookingApi }) => {
    const bookingData = TestData.generateValidBookingPayload();
    const { response } = await bookingApi.createBooking(bookingData);
    const bookingBody = await response.json();
    testBookingId = bookingBody.bookingid;
  });

  test.describe("[HP] Happy Path", () => {
    test("verify successful update of booking with valid token", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload({
        firstname: "UpdatedFirst",
        lastname: "UpdatedLast",
      });

      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        authToken,
      );

      const updated = await updateResult.json();
      bookingApi.assertValidBookingSchema(updated);
      expect(updated.firstname).toBe("UpdatedFirst");
      expect(updated.lastname).toBe("UpdatedLast");
    });

    test("verify update of all booking fields", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload({
        firstname: "NewFirst",
        lastname: "NewLast",
        totalprice: 500,
        depositpaid: false,
        additionalneeds: "Updated needs",
      });

      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        authToken,
      );

      const updated = await updateResult.json();
      bookingApi.assertValidBookingSchema(updated);

      expect(updated.firstname).toBe(updatedPayload.firstname);
      expect(updated.lastname).toBe(updatedPayload.lastname);
      expect(updated.totalprice).toBe(updatedPayload.totalprice);
      expect(updated.depositpaid).toBe(updatedPayload.depositpaid);
      expect(updated.bookingdates.checkin).toBe(
        updatedPayload.bookingdates.checkin,
      );
      expect(updated.bookingdates.checkout).toBe(
        updatedPayload.bookingdates.checkout,
      );
      if (updatedPayload.additionalneeds) {
        expect(updated.additionalneeds).toBe(updatedPayload.additionalneeds);
      }
    });

    test("verify successful update using basic authentication", async ({
      bookingApi,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload({
        firstname: "BasicAuth",
        lastname: "User",
      });

      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        undefined,
        authData.valid,
      );

      const updated = await updateResult.json();
      bookingApi.assertValidBookingSchema(updated);

      expect(updated.firstname).toBe("BasicAuth");
      expect(updated.lastname).toBe("User");
    });
  });

  test.describe("[NC] Negative Cases", () => {
    test("verify rejection of update without authentication", async ({
      bookingApi,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload();
      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
      );
      const status = updateResult.status();

      // API returns 403 instead of expected 401
      expect(status).toBe(401);
    });

    test("verify rejection of update with invalid token", async ({
      bookingApi,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload();
      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        "invalid-token",
      );
      const status = updateResult.status();

      // API returns 403 instead of expected 401
      expect(status).toBe(401);
    });

    test("verify rejection of update with empty token", async ({
      bookingApi,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload();
      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        "",
      );
      const status = updateResult.status();

      // API returns 403 instead of expected 401
      expect(status).toBe(401);
    });

    test("verify rejection of update with invalid basic auth credentials", async ({
      bookingApi,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload();
      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        undefined,
        authData.invalid,
      );

      expect(updateResult.status()).toBe(403);
    });

    test("verify handling of update on non-existent booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload();

      const updateResult = await bookingApi.updateBooking(
        9999999,
        updatedPayload,
        authToken,
      );

      expect(updateResult.status()).toBe(405);
    });

    test("verify handling of update with negative price", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedPayload = TestData.generateValidBookingPayload({
        totalprice: -100,
      });

      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        updatedPayload,
        authToken,
      );

      // Return 200, its able to put negative prices.
      expect(updateResult.status()).toBe(405);
    });

    test("verify handling of update with checkout before checkin", async ({
      bookingApi,
      authToken,
    }) => {
      const invalidPayload = TestData.generateValidBookingPayload({
        bookingdates: {
          checkin: "2025-06-20",
          checkout: "2025-06-10",
        },
      });

      const updateResult = await bookingApi.updateBooking(
        testBookingId,
        invalidPayload,
        authToken,
      );

      // Return 200, its able to update bad dates
      expect(updateResult.status()).toBe(405);
    });
  });
});
