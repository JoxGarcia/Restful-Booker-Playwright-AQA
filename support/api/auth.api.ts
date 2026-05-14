import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { TokenRequest, TokenResponse, authData } from "@data/auth.data";

export class AuthAPI {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async createToken(credentials: Partial<TokenRequest>) {
    const startTime = Date.now();
    const response = await this.request.post(`${this.baseURL}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: credentials,
    });

    const responseTime = Date.now() - startTime;

    return {
      response,
      responseTime,
    };
  }

  async verifyResponse(response: APIResponse, field: string) {
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body[field]).toBeTruthy();
    expect(body[field]).toEqual(expect.any(String));
    this.verifyJsonHeaders(response);
    return body;
  }

  verifyBadCredentialsMessage(reason: string) {
    expect(reason).toBe("Bad credentials");
  }

  verifyJsonHeaders(response: APIResponse) {
    expect(response.headers()["content-type"]).toContain("application/json");
  }

  verifyResponseTime(responseTime: number, expectedMs = 2000) {
    expect(responseTime).toBeLessThan(expectedMs);
  }
}
