import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MANAGER_API } from "../../config/Endpoints/Endpoints";

const managerApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

managerApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

managerApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const upsertManager = createAsyncThunk(
  "manager/upsertManager",
  async (managerData, { rejectWithValue }) => {
    try {
      const response = await managerApiClient.post(MANAGER_API.UPSERT, managerData);
      const { success, data, message, error } = response.data;

      if (!success) {
        throw new Error(message || error || "Failed to create/update manager");
      }

      return data; // Returns { id: number, name: string }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create/update manager";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchManagers = createAsyncThunk(
  "manager/fetchManagers",
  async (competencyId, { rejectWithValue }) => {
    try {
      const response = await managerApiClient.get(MANAGER_API.GET(competencyId));
      const { success, data, message, error } = response.data;

      if (!success) {
        throw new Error(message || error || "Failed to fetch managers");
      }

      return data; // Returns array of { id: number, name: string }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch managers";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteManager = createAsyncThunk(
  "manager/deleteManager",
  async (managerId, { rejectWithValue }) => {
    try {
      const response = await managerApiClient.delete(MANAGER_API.DELETE(managerId));
      const { success, message, error } = response.data;

      if (!success) {
        throw new Error(message || error || "Failed to delete manager");
      }

      return managerId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete manager";
      return rejectWithValue(errorMessage);
    }
  }
);
