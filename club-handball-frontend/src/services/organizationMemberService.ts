import API from "./api";

export type OrganizationMember = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  group: "bureau" | "ca";
  email?: string;
  photo?: string;
  order: number;
  isActive: boolean;
};

export type OrganizationMemberFormData = {
  firstName: string;
  lastName: string;
  role: string;
  group: "bureau" | "ca";
  email?: string;
  photoFile?: File | null;
  isActive?: boolean;
  order?: number;
};

const buildFormData = (data: OrganizationMemberFormData) => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("role", data.role);
  formData.append("group", data.group);
  formData.append("email", data.email || "");
  formData.append("order", String(data.order || 1));
  formData.append("isActive", String(data.isActive ?? true));

  if (data.photoFile) {
    formData.append("photo", data.photoFile);
  }

  return formData;
};

export const getPublicOrganizationMembers = async () => {
  const response = await API.get<OrganizationMember[]>("/organization-members");
  return response.data;
};

export const getAllOrganizationMembersAdmin = async () => {
  const response = await API.get<OrganizationMember[]>(
    "/organization-members/admin/all"
  );
  return response.data;
};

export const createOrganizationMember = async (
  data: OrganizationMemberFormData
) => {
  const formData = buildFormData(data);
  const response = await API.post("/organization-members", formData);
  return response.data;
};

export const updateOrganizationMember = async (
  id: string,
  data: OrganizationMemberFormData
) => {
  const formData = buildFormData(data);
  const response = await API.put(`/organization-members/${id}`, formData);
  return response.data;
};

export const toggleOrganizationMemberStatus = async (id: string) => {
  const response = await API.patch(`/organization-members/${id}/toggle-status`);
  return response.data;
};

export const deleteOrganizationMember = async (id: string) => {
  const response = await API.delete(`/organization-members/${id}`);
  return response.data;
};