import { test as base } from "@playwright/test";
import { AuthAPI } from "@support/api/auth.api";
import { BookingAPI } from "@support/api/booking.api";

import { TokenResponse, authData } from "@data/auth.data";
type Fixtures = {
  authApi: AuthAPI;
  bookingApi: BookingAPI;
  authToken: string;
};

export const test = base.extend<Fixtures>({
  authApi: async ({ request, baseURL }, use) => {
    const authApi = new AuthAPI(request, baseURL || "");
    await use(authApi);
  },

  bookingApi: async ({ request, baseURL }, use) => {
    const bookingApi = new BookingAPI(request, baseURL || "");
    await use(bookingApi);
  },

  authToken: async ({ authApi }, use) => {
    const { response } = await authApi.createToken(authData.valid);
    const tokenBody: TokenResponse = await response.json();
    const token = tokenBody.token;

    if (!token) {
      throw new Error("Failed to generate authentication token for test");
    }

    await use(token);
  },
});

export { expect } from "@playwright/test";
