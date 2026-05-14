export interface TokenRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export const authData = {
  valid: {
    username: "admin",
    password: "password123",
  } satisfies TokenRequest,

  invalid: {
    username: "invaliduser",
    password: "wrongpassword",
  } satisfies TokenRequest,
} as const;
