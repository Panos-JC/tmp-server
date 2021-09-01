export interface AuthData {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  token: string;
  password?: never;
}
