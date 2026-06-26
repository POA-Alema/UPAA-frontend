export const ADMIN_ROLES = ['ADMIN', 'CONTENT_MANAGER'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
  role: AdminRole;
};

export type StoredAuthSession = AuthResponse & {
  password: string;
  savedAt: string;
};
