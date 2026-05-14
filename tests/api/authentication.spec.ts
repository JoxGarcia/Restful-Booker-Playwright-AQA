import { test, expect } from "@fixtures/app.fixture";
import { TokenResponse, TokenRequest, authData } from "@data/auth.data";

test.describe("[API] Authentication API test cases", () => {
  test.describe("[HP] Happy Path", () => {
    test("verify auth token is created with valid credentials", async ({
      authApi,
    }) => {
      const { response, responseTime } = await authApi.createToken(
        authData.valid,
      );
      const body: TokenResponse = await response.json();
      await authApi.verifyResponse(response, "token");
      expect(body.token.length).toBeGreaterThan(0);
      await authApi.verifyResponseTime(responseTime);
    });
  });

  test.describe("[NC] Negative Cases", () => {
    test("verify auth token is not created with invalid username", async ({
      authApi,
    }) => {
      const { response, responseTime } = await authApi.createToken(
        authData.invalid,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });

    test("verify auth token is not created with invalid password", async ({
      authApi,
    }) => {
      const invalidPasswordCredentials: TokenRequest = {
        ...authData.valid,
        password: "wrongpassword",
      };
      const { response, responseTime } = await authApi.createToken(
        invalidPasswordCredentials,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });

    test("verify authentication fails with empty username", async ({
      authApi,
    }) => {
      const emptyUserNameCredentials: TokenRequest = {
        ...authData.valid,
        username: "",
      };
      const { response, responseTime } = await authApi.createToken(
        emptyUserNameCredentials,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });

    test("verify authentication fails with empty password", async ({
      authApi,
    }) => {
      const emptyPasswordCredentials: TokenRequest = {
        ...authData.valid,
        password: "",
      };
      const { response, responseTime } = await authApi.createToken(
        emptyPasswordCredentials,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });

    test("verify authentication fails when username field is missing", async ({
      authApi,
    }) => {
      const { username, ...missingUsernameCredentials } = authData.valid;
      const { response, responseTime } = await authApi.createToken(
        missingUsernameCredentials as TokenRequest,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });

    test("verify authentication fails when password field is missing", async ({
      authApi,
    }) => {
      const { password, ...missingPasswordCredentials } = authData.valid;
      const { response, responseTime } = await authApi.createToken(
        missingPasswordCredentials as TokenRequest,
      );
      const body = await response.json();
      await authApi.verifyResponse(response, "reason");
      await authApi.verifyBadCredentialsMessage(body.reason);
      await authApi.verifyResponseTime(responseTime);
    });
  });
});
