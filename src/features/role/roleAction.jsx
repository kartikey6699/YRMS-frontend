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

      console.log(response, "response.data   ")

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


export const fetchCompetencyAdmins = createAsyncThunk(
  "role/fetchCompetencyAdmins",
  async (competencyId, { rejectWithValue }) => {
    try {
      const url =  `http://localhost:8000/competency/competency-users/${competencyId}/Admin`
      const response = await rolesApiClient.get(url, {
        headers: {
          accept: "application/json",
        },
      });
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch admins");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch admins";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "role/updateUserRole",
  async ({ competency_id, user_id, role, action_type }, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.post(
        `http://localhost:8000/competency/user-role-update`,
        { competency_id, user_id, role, action_type },
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to update user role");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user role";
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchAvailableAdmins = createAsyncThunk(
  "role/fetchAvailableAdmins",
  async ({ public_id, role_types = ["admin", "superadmin"], action_type = 2 }, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.post(
        `http://localhost:8000/competency/user-list`,
        { public_id, role_types, action_type },
        {
          headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHlhc2guY29tIiwicGFzc3dvcmQiOiIkMmIkMTIkVS9JTk1VNkQ5UXl4b2M1OXE0U1V5dXlabml4SHBLTnlpY2RmcVJtRlRmNVBqNlM5MlBJNW0iLCJleHAiOjE3NDYwMTY2MDd9.C3EBtjCdnDH3RoDlKGPjN0VE6wXA_uj4RpmAeClEzXE",
            "Content-Type": "application/json",
          },
        }
      );
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch available admins");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch available admins";
      return rejectWithValue(errorMessage);
    }
  }
);