import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ROLE_API, FEATURE_API } from "../../config/Endpoints/Endpoints";


const rolesApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

rolesApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.get(ROLE_API.LIST, {
        headers: {
          accept: "application/json"
        }
      });
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || "Failed to fetch roles");
      }
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch roles";
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchFeatures = createAsyncThunk(
  "role/fetchFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.get(FEATURE_API.LIST, {
        headers: {
          accept: "application/json"
        }
      });
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch roles");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch roles";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createRoles = createAsyncThunk(
  "role/createRoles",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.post(ROLE_API.CREATE, roleData);
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to create role");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create role";
      return rejectWithValue(errorMessage);
    }
  }
);


export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (Id, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.delete(
        `${ROLE_API.DELETE}/${Id}`
      );

      return Id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete role";
      return rejectWithValue(errorMessage);
    }
  }
);
