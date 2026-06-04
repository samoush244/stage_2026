// src/services/eventService.ts

import API from "./api";

export type EventPayload = {
  title: string;
  type: "Match" | "Tournoi" | "Stage" | "Soirée club" | "Autre";
  date: string;
  time: string;
  location: string;
  image?: string;
  description: string;
  ticketUrl: string;
  ticketLabel?: string;
  isTicketingEnabled: boolean;
  isPublished: boolean;
};

export type EventItem = EventPayload & {
  _id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export const getAdminEvents = async () => {
  const response = await API.get("/events/admin/all");
  return response.data;
};

export const createEvent = async (data: FormData) => {
  const response = await API.post("/events", data,{
    headers :{
      "content-type":"multipart/form-data",
    }
  });
  return response.data;
};

export const updateEvent = async (id: string, data: FormData) => {
  const response = await API.put(`/events/${id}`, data, {
    headers: {
      "content-type": "multipart/form-data",
    }
  });
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await API.delete(`/events/${id}`);
  return response.data;
};

export const getPublicEvents = async () => {
  const response = await API.get("/events/public");
  return response.data;
};