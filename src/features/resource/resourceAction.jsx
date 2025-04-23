import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RESOURCE_API, DESIGNATION_API, COMPETENCY_API, BASELINE, TRAINING_TECHNOLOGY_API, TECHNOLOGY_BASELINE_API, ROLE_API } from "../../config/Endpoints/Endpoints";


const resourceApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

resourceApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
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
  async (
    {
      experience,
      communication,
      certification,
      technology,
      role_id, // New optional parameter
      page = 1,
      size = 10
    } = {},
    { rejectWithValue }
  ) => {
    try {
      // Map communication values to API-expected numbers
      const communicationMap = {
        Average: "1",
        Medium: "2",
        Fluent: "3",
      };
      const mappedCommunication = communication
        ? communicationMap[communication] || communication
        : undefined;

      // Convert technology array to comma-separated string
      const technologyString = Array.isArray(technology) ? technology.join(",") : technology;

      const params = new URLSearchParams({
        ...(experience && { experience }),
        ...(mappedCommunication && { communication: mappedCommunication }),
        ...(certification && { certification }),
        ...(technologyString && { technology: technologyString }),
        ...(role_id && { role_id }), // Include role_id if provided
        page,
        size
      });

      console.log("params log", params.toString());

      const response = await resourceApiClient.get(
        `${RESOURCE_API.LIST_RESOURCES}?${params.toString()}`
      );
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to fetch resources");
      }

      return data;
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

export const updateResource = createAsyncThunk(
  "resource/updateResource",
  async ({ publicId, resourceData }, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.patch(
        `${RESOURCE_API.UPDATE_RESOURCE}/${publicId}`,
        resourceData
      );
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to update resource");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update resource";
      return rejectWithValue(errorMessage);
    }
  }
);


export const deleteResource = createAsyncThunk(
  "resource/deleteResource",
  async (publicId, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.delete(
        `${RESOURCE_API.DELETE_RESOURCE}/${publicId}`
      );

      return publicId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete resource";
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchDesignations = createAsyncThunk(
  "resource/fetchDesignations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(DESIGNATION_API.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createDesignation = createAsyncThunk(
  "resource/createDesignation",
  async (name, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.post(DESIGNATION_API.CREATE, { name });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateDesignation = createAsyncThunk(
  "resource/updateDesignation",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.patch(`${DESIGNATION_API.UPDATE}/${id}`, { name });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  "resource/deleteDesignation",
  async (id, { rejectWithValue }) => {
    try {
      await resourceApiClient.delete(`${DESIGNATION_API.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Competency CRUD Operations
export const fetchCompetencies = createAsyncThunk(
  "resource/fetchCompetencies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(COMPETENCY_API.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCompetency = createAsyncThunk(
  "resource/createCompetency",
  async (name, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.post(COMPETENCY_API.CREATE, { name });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCompetency = createAsyncThunk(
  "resource/updateCompetency",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.patch(`${COMPETENCY_API.UPDATE}/${id}`, { name });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCompetency = createAsyncThunk(
  "resource/deleteCompetency",
  async (id, { rejectWithValue }) => {
    try {
      await resourceApiClient.delete(`${COMPETENCY_API.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTrainingTechnologies = createAsyncThunk(
  "resource/fetchTrainingTechnologies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(TRAINING_TECHNOLOGY_API.GET);
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to fetch training technologies");
      }

      return data; // Return the entire data object containing technologies and totalCount
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch training technologies";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTrainingTechnology = createAsyncThunk(
  "resource/createTrainingTechnology",
  async (name, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.post(TRAINING_TECHNOLOGY_API.POST, { name });
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to create training technology");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create training technology";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTrainingTechnology = createAsyncThunk(
  "resource/updateTrainingTechnology",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.patch(`${TRAINING_TECHNOLOGY_API.UPDATE}${id}`, { name });
      const { success, data } = response.data;

      if (!success) {
        throw new Error("Failed to update training technology");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update training technology";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTrainingTechnology = createAsyncThunk(
  "resource/deleteTrainingTechnology",
  async (id, { rejectWithValue }) => {
    try {
      await resourceApiClient.delete(`${TRAINING_TECHNOLOGY_API.DELETE}${id}`);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete training technology";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTechnologies = createAsyncThunk(
  "resource/fetchTechnologies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get(TECHNOLOGY_BASELINE_API.GET, {
        headers: {
          accept: "application/json"
        }
      });
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch technologies");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch technologies";
      return rejectWithValue(errorMessage);
    }
  }
);