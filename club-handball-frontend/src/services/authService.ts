import API from "./api";

export type LoginData = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type ActivateAccountData ={
  licenseNumber:string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const activateAccount = async (
  data: ActivateAccountData
): Promise<LoginResponse> => {
  const response = await fetch(`/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur lors de l'activation du compte.");
  }

  return result;
};