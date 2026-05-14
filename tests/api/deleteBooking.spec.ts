import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";
import { authData } from "@data/auth.data";

test.describe("[API][DELETE] Booking API - DeleteBooking", () => {
  test.describe("[HP] Happy Path", () => {
    test("verify successful deletion of booking with valid token", async ({
      bookingApi,
      authToken,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
        authToken,
      );

      expect(deleteResult.status()).toBe(201);

      // Verify booking no longer exists
      const getResult = await bookingApi.getBooking(bookingBody.bookingid);
      expect(getResult.status()).toBe(404);
    });

    test("verify successful deletion of booking with basic authentication", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
        undefined,
        authData.valid,
      );

      expect(deleteResult.status()).toBe(201);

      // Verify booking no longer exists
      const getResult = await bookingApi.getBooking(bookingBody.bookingid);
      expect(getResult.status()).toBe(404);
    });
  });

  test.describe("[NC] Negative Cases", () => {
    test("verify rejection of delete booking without authentication", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
      );

      expect(deleteResult.status()).toBe(403);

      // Booking should still exist
      const getResult = await bookingApi.getBooking(bookingBody.bookingid);
      expect(getResult.status()).toBe(200);
    });

    test("verify rejection of delete booking with invalid token", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
        "invalid-token-12345",
      );

      expect(deleteResult.status()).toBe(403);

      const getResult = await bookingApi.getBooking(bookingBody.bookingid);
      expect(getResult.status()).toBe(200);
    });

    test("verify rejection of delete booking with empty token", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
        "",
      );

      expect(deleteResult.status()).toBe(403);
    });

    test("verify rejection of delete booking with malformed authorization header", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();

      const deleteResult = await bookingApi.deleteBooking(
        bookingBody.bookingid,
        "malformed-header",
      );

      expect(deleteResult.status()).toBe(403);
    });

    test("verify handling of delete non-existent booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const nonExistentId = 9999999;
      const deleteResult = await bookingApi.deleteBooking(
        nonExistentId,
        authToken,
      );

      expect(deleteResult.status()).toBe(405);
    });

    test("verify handling of delete with negative booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const deleteResult = await bookingApi.deleteBooking(-1, authToken);
      expect(deleteResult.status()).toBe(405);
    });

    test("verify handling of delete with zero booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const deleteResult = await bookingApi.deleteBooking(0, authToken);
      expect(deleteResult.status()).toBe(405);
    });

    test("verify cannot update booking after deletion", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      const bookingBody = await response.json();
      // Delete booking
      await bookingApi.deleteBooking(bookingBody.bookingid);
      // Attempt to update deleted booking
      const updatedData = TestData.generateValidBookingPayload();
      const updateResult = await bookingApi.updateBooking(
        bookingBody.bookingid,
        updatedData,
      );
      expect(updateResult.status()).toBe(403);
    });
  });
});
