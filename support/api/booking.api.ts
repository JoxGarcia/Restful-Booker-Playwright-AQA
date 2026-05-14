import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import {
  BookingResponse,
  BookingPayload,
  BookingIDs,
} from "@data/booking.data";

export class BookingAPI {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async createBooking(
    booking: BookingPayload,
    token?: string,
    tenantId?: string,
  ) {
    const startTime = Date.now();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Cookie"] = `token=${token}`;
    }

    if (tenantId) {
      headers["X-Tenant-Id"] = tenantId;
    }

    const response = await this.request.post(`${this.baseURL}/booking`, {
      headers,
      data: booking,
    });

    const responseTime = Date.now() - startTime;

    return {
      response,
      responseTime,
    };
  }

  async assertValidCreateBookingResponseSchema(
    response: APIResponse,
  ): Promise<BookingResponse> {
    const body = (await response.json()) as BookingResponse;
    expect(response.status()).toBe(200);
    expect(body, "Response should have bookingid property").toHaveProperty(
      "bookingid",
    );
    expect(body, "Response should have booking property").toHaveProperty(
      "booking",
    );

    expect(typeof body.bookingid).toBe("number");
    expect(body.bookingid, "bookingid object should be present").toBeDefined();
    expect(body.booking, "booking object should be present").toBeDefined();

    this.assertValidBookingSchema(body.booking);

    return body;
  }

  async assertValidBookingSchema(
    booking: BookingPayload,
  ): Promise<BookingPayload> {
    expect(booking.firstname, "firstname should be present").toBeDefined();
    expect(booking.lastname, "lastname should be present").toBeDefined();
    expect(booking.totalprice, "totalprice should be present").toBeDefined();
    expect(booking.depositpaid, "depositpaid should be present").toBeDefined();
    expect(
      booking.bookingdates,
      "bookingdates should be present",
    ).toBeDefined();

    expect(typeof booking.firstname).toBe("string");
    expect(typeof booking.lastname).toBe("string");
    expect(typeof booking.totalprice).toBe("number");
    expect(typeof booking.depositpaid).toBe("boolean");

    expect(
      booking.bookingdates.checkin,
      "checkin should be in YYYY-MM-DD format",
    ).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(
      booking.bookingdates.checkout,
      "checkout should be in YYYY-MM-DD format",
    ).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    if (booking.additionalneeds !== undefined) {
      expect(typeof booking.additionalneeds).toBe("string");
    } else {
      expect(
        booking,
        "additionalneeds should NOT exist in the payload when not provided",
      ).not.toHaveProperty("additionalneeds");
    }
    return booking;
  }

  private encodeBasicAuth(username: string, password: string): string {
    return Buffer.from(`${username}:${password}`).toString("base64");
  }

  async deleteBooking(
    bookingId: number,
    token?: string,
    basicAuth?: { username: string; password: string },
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Cookie"] = `token=${token}`;
    } else if (basicAuth) {
      headers["Authorization"] = `Basic ${this.encodeBasicAuth(
        basicAuth.username,
        basicAuth.password,
      )}`;
    }

    return this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers,
    });
  }

  async getBooking(bookingId: number, token?: string, tenantId?: string) {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Cookie"] = `token=${token}`;
    }

    if (tenantId) {
      headers["X-Tenant-Id"] = tenantId;
    }

    return this.request.get(`${this.baseURL}/booking/${bookingId}`, {
      headers,
    });
  }

  async getBookingIds(params?: BookingIDs) {
    return this.request.get(`${this.baseURL}/booking`, {
      headers: {
        Accept: "application/json",
      },
      params: params as Record<string, string | number | boolean>,
    });
  }

  async assertBookingIdInFilteredResponse(
    response: any,
    expectedBookingId: number,
    message?: string,
  ): Promise<any[]> {
    const apiResponse = response.response || response;

    expect(
      apiResponse.status(),
      message || "Filter response should be 200",
    ).toBe(200);

    const bookingIds = await apiResponse.json();

    expect(
      Array.isArray(bookingIds),
      "Response should be an array",
    ).toBeTruthy();

    console.log(bookingIds);
    const found = bookingIds.find(
      (b: any) => b.bookingid === expectedBookingId,
    );

    console.log(found);
    expect(
      found,
      `Booking ID ${expectedBookingId} should be in filtered results`,
    ).toBeDefined();
    expect(found?.bookingid).toBe(expectedBookingId);

    return bookingIds;
  }

  async updateBooking(
    bookingId: number,
    booking: BookingPayload,
    token?: string,
    basicAuth?: { username: string; password: string },
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Add authentication - either token or basic auth
    if (token) {
      headers["Cookie"] = `token=${token}`;
    } else if (basicAuth) {
      headers["Authorization"] = `Basic ${this.encodeBasicAuth(
        basicAuth.username,
        basicAuth.password,
      )}`;
    }

    return this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      headers,
      data: booking,
    });
  }

  verifyResponseTime(responseTime: number, expectedMs = 2000) {
    expect(responseTime).toBeLessThan(expectedMs);
  }
}
