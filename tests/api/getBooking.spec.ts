import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";

test.describe("[API][GET] Booking API - GetBooking", () => {
  test.describe("[HP] Happy Path", () => {
    let testBookingId: number;
    let bookingBody: any;
    test.beforeEach(async ({ bookingApi }) => {
      const bookingData = TestData.generateValidBookingPayload();
      const { response } = await bookingApi.createBooking(bookingData);
      bookingBody = await response.json();
      testBookingId = bookingBody.bookingid;
    });

    test("verify retrieval of an existing booking by ID", async ({
      bookingApi,
    }) => {
      const getResult = await bookingApi.getBooking(testBookingId);

      const booking = await getResult.json();
      bookingApi.assertValidBookingSchema(booking);
      expect(booking.firstname).toBeTruthy();
      expect(booking.lastname).toBeTruthy();
      expect(booking.totalprice).toBeGreaterThanOrEqual(0);
      expect(typeof booking.depositpaid).toBe("boolean");
      expect(booking.bookingdates).toBeDefined();
    });

    test("verify response is returned in JSON format", async ({
      bookingApi,
    }) => {
      const getResult = await bookingApi.getBooking(testBookingId);
      expect(getResult.status()).toBe(200);
      expect(getResult.headers()["content-type"]).toContain("application/json");
    });

    test("verify retrieval of booking with all optional fields", async ({
      bookingApi,
    }) => {
      const additionalneeds = "Breakfast and late checkout";
      const bookingPayload = TestData.generateValidBookingPayload({
        additionalneeds,
      });
      const { response } = await bookingApi.createBooking(bookingPayload);
      const created = await response.json();
      const getResult = await bookingApi.getBooking(created.bookingid);
      const result = await getResult.json();

      bookingApi.assertValidBookingSchema(result);
      expect(result.additionalneeds).toBe(additionalneeds);
    });

    test("verify retrieval of all booking IDs without filters", async ({
      bookingApi,
    }) => {
      const getResult = await bookingApi.getBookingIds();
      const response = await getResult.json();
      expect(Array.isArray(response)).toBeTruthy();
      expect(response.length).toBeGreaterThan(0);
    });

    test("verify filtering bookings by firstname", async ({ bookingApi }) => {
      const uniqueFirstname = `TestUser_${Date.now()}`;

      const bookingPayload = TestData.generateValidBookingPayload({
        firstname: uniqueFirstname,
        lastname: "FilterTest",
      });

      const { response } = await bookingApi.createBooking(bookingPayload);
      const booking = await response.json();

      const filterResult = await bookingApi.getBookingIds({
        firstname: uniqueFirstname,
      });

      await bookingApi.assertBookingIdInFilteredResponse(
        filterResult,
        booking.bookingid,
      );
    });

    test("verify filtering bookings by lastname", async ({ bookingApi }) => {
      const uniqueLastname = `TestLast_${Date.now()}`;

      const bookingPayload = TestData.generateValidBookingPayload({
        firstname: "FilterTest",
        lastname: uniqueLastname,
      });

      const { response } = await bookingApi.createBooking(bookingPayload);
      const booking = await response.json();

      const filterResult = await bookingApi.getBookingIds({
        lastname: uniqueLastname,
      });

      await bookingApi.assertBookingIdInFilteredResponse(
        filterResult,
        booking.bookingid,
      );
    });

    test("verify filtering bookings by both firstname and lastname", async ({
      bookingApi,
    }) => {
      const uniqueFirstname = `First_${Date.now()}`;
      const uniqueLastname = `Last_${Date.now()}`;

      const bookingPayload = TestData.generateValidBookingPayload({
        firstname: uniqueFirstname,
        lastname: uniqueLastname,
      });

      const { response } = await bookingApi.createBooking(bookingPayload);
      const booking = await response.json();

      const filterResult = await bookingApi.getBookingIds({
        firstname: uniqueFirstname,
        lastname: uniqueLastname,
      });

      await bookingApi.assertBookingIdInFilteredResponse(
        filterResult,
        booking.bookingid,
      );
    });
  });

  test.describe("[NC] Negative Cases", () => {
    test("verify handling of non-existent booking ID", async ({
      bookingApi,
    }) => {
      const nonExistentId = 9999999;
      const getResult = await bookingApi.getBooking(nonExistentId);

      expect(getResult.status()).toBe(404);
    });

    test("verify handling of negative booking ID", async ({ bookingApi }) => {
      const getResult = await bookingApi.getBooking(-1);
      expect(getResult.status()).toBe(404);
    });

    test("verify handling of zero booking ID", async ({ bookingApi }) => {
      const getResult = await bookingApi.getBooking(0);
      expect(getResult.status()).toBe(404);
    });

    test("verify handling of very large booking ID", async ({ bookingApi }) => {
      const getResult = await bookingApi.getBooking(Number.MAX_SAFE_INTEGER);
      expect(getResult.status()).toBe(404);
    });

    test("verify empty array when filtering by non-existent firstname", async ({
      bookingApi,
    }) => {
      const nonExistentName = `NonExistent_${Date.now()}`;

      const filterResult = await bookingApi.getBookingIds({
        firstname: nonExistentName,
      });

      expect(filterResult.status()).toBe(200);

      const bookingIds = await filterResult.json();

      expect(bookingIds.length).toBe(0);
    });

    test("verify handling of future dates far in the future", async ({
      bookingApi,
    }) => {
      const filterResult = await bookingApi.getBookingIds({
        checkin: "2099-12-31",
      });

      expect(filterResult.status()).toBe(200);

      const bookingIds = await filterResult.json();

      expect(Array.isArray(bookingIds)).toBeTruthy();
    });

    test("verify handling of past dates", async ({ bookingApi }) => {
      const filterResult = await bookingApi.getBookingIds({
        checkin: "2000-01-01",
      });

      expect(filterResult.status()).toBe(200);

      const bookingIds = await filterResult.json();

      expect(Array.isArray(bookingIds)).toBeTruthy();
    });
  });
});
