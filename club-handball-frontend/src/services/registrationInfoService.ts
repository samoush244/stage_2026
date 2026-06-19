import API from "./api";

export type RegistrationDocument = {
  _id: string;
  title: string;
  fileUrl: string;
  publicId?: string;
  resourceType?: string;
  order: number;
  isActive: boolean;
};

export type RegistrationInfo = {
  _id?: string;
  season: string;
  documents: RegistrationDocument[];
  paymentMethodsText: string;
  reductionsText: string;
  pricingImageUrl?: string;
  pricingImagePublicId?: string;
  pricingImageResourceType?: string;
  isActive: boolean;
};

export const getPublicRegistrationInfo = async (): Promise<RegistrationInfo | null> => {
  const res = await API.get("/registration-info");
  return res.data;
};

export const getAdminRegistrationInfo = async (): Promise<RegistrationInfo> => {
  const res = await API.get("/registration-info/admin");
  return res.data;
};

export const updateRegistrationInfo = async (data: {
  season: string;
  paymentMethodsText: string;
  reductionsText: string;
  isActive: boolean;
}): Promise<RegistrationInfo> => {
  const res = await API.put("/registration-info/admin", data);
  return res.data.registrationInfo;
};

export const addRegistrationDocument = async (data: {
  title: string;
  order: number;
  isActive: boolean;
  file: File;
}): Promise<RegistrationInfo> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("order", String(data.order));
  formData.append("isActive", String(data.isActive));
  formData.append("file", data.file);

  const res = await API.post("/registration-info/admin/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.registrationInfo;
};

export const updateRegistrationDocument = async (
  documentId: string,
  data: {
    title: string;
    order: number;
    isActive: boolean;
  }
): Promise<RegistrationInfo> => {
  const res = await API.put(`/registration-info/admin/documents/${documentId}`, data);
  return res.data.registrationInfo;
};

export const deleteRegistrationDocument = async (
  documentId: string
): Promise<RegistrationInfo> => {
  const res = await API.delete(`/registration-info/admin/documents/${documentId}`);
  return res.data.registrationInfo;
};

export const updatePricingImage = async (image: File): Promise<RegistrationInfo> => {
  const formData = new FormData();

  formData.append("image", image);

  const res = await API.post("/registration-info/admin/pricing-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.registrationInfo;
};

export const deletePricingImage = async (): Promise<RegistrationInfo> => {
  const res = await API.delete("/registration-info/admin/pricing-image");
  return res.data.registrationInfo;
};