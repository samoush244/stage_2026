import API from "./api";

export const getPublicHistories = async () => {
  const response = await API.get("/histories/public");
  return response.data;
};

export const getAdminHistories = async () => {
  const response = await API.get("/histories/admin/all");
  return response.data;
};

export const createHistory = async (formData: FormData) => {
  const response = await API.post("/histories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateHistory = async (id: string, formData: FormData) => {
  const response = await API.put(`/histories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteHistory = async (id: string) => {
  const response = await API.delete(`/histories/${id}`);
  return response.data;
};

export const toggleHistoryStatus = async (id: string) => {
  const response = await API.patch(`/histories/${id}/toggle-status`);
  return response.data;
};