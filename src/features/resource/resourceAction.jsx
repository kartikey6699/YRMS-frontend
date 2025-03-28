import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RESOURCE_API } from "../../config/Endpoints/Endpoints";


const resourceApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

resourceApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createResource = createAsyncThunk(
  "resource/createResource",
  async (resourceData, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.post(RESOURCE_API.CREATE_RESOURCE, resourceData);
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to create resource");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create resource";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(RESOURCE_API.LIST_RESOURCES);
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to fetch resources");
      }

      return data.users;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch resources";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchResourceDetails = createAsyncThunk(
  "resource/fetchDetails",
  async (publicId, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(`${RESOURCE_API.USER_DETAIL}/${publicId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch resource details");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);