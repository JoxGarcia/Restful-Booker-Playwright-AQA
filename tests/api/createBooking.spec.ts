import { test, expect } from "@fixtures/app.fixture";
import { TestData } from "@utils/testData";
import { BookingPayload } from "@data/booking.data";

test.describe("[API][CREATE] Booking API - CreateBooking", () => {
  test.describe("[HP] Happy Path", () => {
    test("verify creation of a new booking with valid data", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload();
      const { response, responseTime } =
        await bookingApi.createBooking(bookingPayload);
      await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);
    });

    test("verify creation of booking without optional additionalneeds field", async ({
      bookingApi,
    }) => {
      const bookingWithoutNeeds = TestData.generateValidBookingPayload({
        additionalneeds: undefined,
      });
      const { response, responseTime } =
        await bookingApi.createBooking(bookingWithoutNeeds);
      await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);
    });

    test("verify creation of booking with depositpaid=true", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload({
        depositpaid: true,
      });
      const { response, responseTime } =
        await bookingApi.createBooking(bookingData);
      const createdBooking =
        await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);

      expect(createdBooking.booking.depositpaid).toBe(true);
    });

    test("verify creation of booking with depositpaid=false", async ({
      bookingApi,
    }) => {
      const bookingData = TestData.generateValidBookingPayload({
        depositpaid: false,
      });
      const { response, responseTime } =
        await bookingApi.createBooking(bookingData);
      const createdBooking =
        await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);
      expect(createdBooking.booking.depositpaid).toBe(false);
    });

    test("verify creation of booking with minimum price (1)", async ({
      bookingApi,
    }) => {
      const price = 1;
      const bookingData = TestData.generateBookingWithPrice(price);
      const { response, responseTime } =
        await bookingApi.createBooking(bookingData);
      const createdBooking =
        await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);
      expect(createdBooking.booking.totalprice).toBe(price);
    });

    test("verify creation of booking with high price", async ({
      bookingApi,
    }) => {
      const price = 99999;
      const bookingData = TestData.generateBookingWithPrice(price);
      const { response, responseTime } =
        await bookingApi.createBooking(bookingData);
      const createdBooking =
        await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);
      expect(createdBooking.booking.totalprice).toBe(price);
    });

    test("verify creation of multiple bookings with same guest name", async ({
      bookingApi,
    }) => {
      const guest = {
        firstname: "Jose",
        lastname: "Garcia",
      };

      const bookingData1 = TestData.generateValidBookingPayload(guest);
      const bookingData2 = TestData.generateValidBookingPayload(guest);
      const { response: bookingResponse_1 } =
        await bookingApi.createBooking(bookingData1);

      const { response: bookingResponse_2 } =
        await bookingApi.createBooking(bookingData2);

      const booking1 =
        await bookingApi.assertValidCreateBookingResponseSchema(
          bookingResponse_1,
        );
      const booking2 =
        await bookingApi.assertValidCreateBookingResponseSchema(
          bookingResponse_2,
        );

      expect(booking1.bookingid).not.toBe(booking2.bookingid);
    });

    test("verify creation of booking with long additionalneeds text", async ({
      bookingApi,
    }) => {
      const longText =
        "Breakfast, Lunch, Dinner, Late checkout, Early checkin, Airport shuttle, Extra towels, Room service".repeat(
          3,
        );
      const bookingData = TestData.generateValidBookingPayload({
        additionalneeds: longText,
      });

      const { response, responseTime } =
        await bookingApi.createBooking(bookingData);
      const bookingBody =
        await bookingApi.assertValidCreateBookingResponseSchema(response);
      await bookingApi.verifyResponseTime(responseTime);

      expect(bookingBody.booking.additionalneeds).toBe(longText);
    });
  });

  test.describe("[NC] Negative Cases", () => {
    test("verify rejection of booking with missing firstname", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload();
      const invalidPayload = { ...bookingPayload } as any;
      delete invalidPayload.firstname;
      const bookingResponse = await bookingApi.createBooking(
        invalidPayload as BookingPayload,
      );
      expect(bookingResponse.response.status()).toBe(400);
    });

    test("verify rejection of booking with missing lastname", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload();
      const invalidPayload = { ...bookingPayload } as any;
      delete invalidPayload.lastname;
      const bookingResponse = await bookingApi.createBooking(
        invalidPayload as BookingPayload,
      );
      expect(bookingResponse.response.status()).toBe(400);
    });

    test("verify rejection of booking with missing totalprice", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload();
      const invalidPayload = { ...bookingPayload } as any;
      delete invalidPayload.totalprice;
      const bookingResponse = await bookingApi.createBooking(
        invalidPayload as BookingPayload,
      );
      expect(bookingResponse.response.status()).toBe(400);
    });

    test("verify rejection of booking with missing bookingdates", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload();
      const invalidPayload = { ...bookingPayload } as any;
      delete invalidPayload.bookingdates;
      const bookingResponse = await bookingApi.createBooking(
        invalidPayload as BookingPayload,
      );
      expect(bookingResponse.response.status()).toBe(400);
    });

    test("verify handling of negative price", async ({ bookingApi }) => {
      const price = -100;
      const bookingData = TestData.generateBookingWithPrice(price);
      const { response } = await bookingApi.createBooking(bookingData);
      expect(response.status()).toBe(400);
    });

    test("verify handling of zero price", async ({ bookingApi }) => {
      const price = 0;
      const bookingData = TestData.generateBookingWithPrice(price);
      const { response } = await bookingApi.createBooking(bookingData);
      expect(response.status()).toBe(400);
    });

    test("verify handling of invalid date format in checkin", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload({
        bookingdates: {
          checkin: "01-01-2024",
          checkout: "2024-01-05",
        },
      });
      const { response } = await bookingApi.createBooking(bookingPayload);
      const body = await response.json();
      // NOTE: API accepts invalid date format (MM-DD-YYYY) and auto-corrects it.
      expect(response.status()).toBe(200);
      expect(body.bookingid).toBeGreaterThan(0);
      expect(body.booking.bookingdates.checkin).toBe("2024-01-01");
    });

    test("verify rejection of booking when checkout is before checkin", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload({
        bookingdates: { checkin: "2025-06-10", checkout: "2025-06-05" },
      });

      const { response } = await bookingApi.createBooking(bookingPayload);
      // NOTE: API allows checkout before checkin (business validation missing)
      expect(response.status()).toBe(400);
    });

    test("verify handling of booking with past dates", async ({
      bookingApi,
    }) => {
      const bookingPayload = TestData.generateValidBookingPayload({
        bookingdates: { checkin: "2023-12-01", checkout: "2023-12-05" },
      });

      const { response } = await bookingApi.createBooking(bookingPayload);
      // NOTE:  API accepts past dates for bookings
      expect(response.status()).toBe(400);
    });
  });
});
