import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { INTERN_TASK_API } from "../../config/Endpoints/Endpoints";

const internTaskApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

internTaskApiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createInternTask = createAsyncThunk(
    "internTask/createInternTask",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await internTaskApiClient.post(INTERN_TASK_API.CREATE, payload);
            const { success, data, message } = response.data;

            if (!success) {
                throw new Error(message || "Failed to create internTask");
            }

            return data?.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to create intern";
            return rejectWithValue(errorMessage);
        }
    }
);


export const fetchInternTask = createAsyncThunk(
    "internTask/fetchInterns",
    async (internId, { rejectWithValue }) => {
        try {
            const response = await internTaskApiClient.get(
                `${INTERN_TASK_API.LIST}${internId}`
            );
            const { success, data } = response.data;

            if (!success) {
                throw new Error("Failed to fetch interns");
            }

            return data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch interns";
            return rejectWithValue(errorMessage);
        }
    }
);


// export const fetchInternTaskDetails = createAsyncThunk(
//     "internTask/fetchInternTaskDetails",
//     async (publicId, { rejectWithValue }) => {
//         try {
//             const response = await internTaskApiClient.get(`${INTERN_TASK_API.DETAIL}/${publicId}`);
//             if (!response.data.success) {
//                 throw new Error("Failed to fetch intern details");
//             }
//             return response.data.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

export const deleteInternTask = createAsyncThunk(
    "internTask/deleteInternTask",
    async (id, { rejectWithValue }) => {
        try {
            await internTaskApiClient.delete(`${INTERN_TASK_API.DELETE}${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
