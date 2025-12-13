// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];
export interface RefreshResponse {
  sessionToken: string;
}
export interface SessionResponse {
  isAuthenticated: boolean;
  user: {
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastName: string | null;
  } | null;
}

// Operation query parameter interfaces
