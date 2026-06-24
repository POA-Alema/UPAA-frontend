import type { AdminRole } from '@/types/auth';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserFormData = {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
};
