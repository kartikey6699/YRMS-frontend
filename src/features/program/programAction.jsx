import { createAsyncThunk } from "@reduxjs/toolkit";
import { FEEDBACK_API, ATTENDANCE_API, PARTICIPANT_TASKS_API, PARTICIPANT_DETAIL_API, PROGRAM_API } from "../../config/Endpoints/Endpoints";
import axios from "axios";

const programApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

programApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Action to fetch training feedback
export const fetchTrainingFeedback = createAsyncThunk(
  "training/fetchFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(FEEDBACK_API.LIST);
      if (!response.data.success) {
        throw new Error("Failed to fetch training feedback");
      }
      return response.data.data.feedbacks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to add training feedback
export const addTrainingFeedback = createAsyncThunk(
  "training/addFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await programApiClient.post(FEEDBACK_API.ADD, feedbackData);
      if (!response.data.success) {
        throw new Error("Failed to add training feedback");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to update training feedback
export const updateTrainingFeedback = createAsyncThunk(
  "training/updateFeedback",
  async ({ publicId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await programApiClient.patch(FEEDBACK_API.UPDATE(publicId), feedbackData);
      if (!response.data.success) {
        throw new Error("Failed to update training feedback");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to delete training feedback
export const deleteTrainingFeedback = createAsyncThunk(
  "training/deleteFeedback",
  async (publicId, { rejectWithValue }) => {
    try {
      await programApiClient.delete(FEEDBACK_API.DELETE(publicId));
      return publicId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to create attendance for training
export const createTrainingAttendance = createAsyncThunk(
  "attendance/create",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await programApiClient.post(ATTENDANCE_API.CREATE, attendanceData);
      if (!response.data.success) {
        throw new Error("Failed to create training attendance");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to fetch attendance for a specific program
export const fetchProgramAttendance = createAsyncThunk(
  "attendance/fetchProgram",
  async ({ programId, attendanceDate }, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(ATTENDANCE_API.PROGRAM(programId), {
        params: {
          attendance_date: attendanceDate,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch program attendance");
      }
      return response.data.data.attendanceRecords;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to fetch users absent for a specific program
export const fetchUsersAbsent = createAsyncThunk(
  "attendance/fetchUsersAbsent",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(ATTENDANCE_API.USERS_ABSENT(programId));
      if (!response.data.success) {
        throw new Error("Failed to fetch users absent");
      }
      return response.data.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to post participant tasks
export const postParticipantTask = createAsyncThunk(
  "participantTasks/post",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await programApiClient.post(PARTICIPANT_TASKS_API.POST, taskData);
      if (!response.data.success) {
        throw new Error("Failed to post participant task");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to get participant tasks
export const fetchParticipantTasks = createAsyncThunk(
  "participantTasks/get",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(`${PARTICIPANT_TASKS_API.GET}?program_id=${programId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch participant tasks");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to update a specific participant task
export const updateParticipantTask = createAsyncThunk(
  "participantTasks/updateTask",
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const response = await programApiClient.put(PARTICIPANT_TASKS_API.UPDATE(taskId), data);
      if (!response.data.success) {
        throw new Error("Failed to update participant task");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to delete a specific participant task
export const deleteParticipantTask = createAsyncThunk(
  "participantTasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await programApiClient.delete(PARTICIPANT_TASKS_API.DELETE(taskId));
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

// Action to create training/upscaling program
export const createProgram = createAsyncThunk(
  "program/create",
  async (programData, { rejectWithValue }) => {
    try {
      const response = await programApiClient.post(PROGRAM_API.CREATE, programData);
      if (!response.data.success) {
        throw new Error("Failed to create Training/Upscaling Program");
      }
      console.log("response.data.data: ",response.data.data)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to get list of training/upscaling programs
export const fetchProgramList = createAsyncThunk(
  "programList/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(PROGRAM_API.LIST);
      if (!response.data.success) {
        throw new Error("Failed to fetch Program list");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const fetchParticipantsDetails = createAsyncThunk(
  "participantDetails/get",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(`${PARTICIPANT_DETAIL_API.GET}${programId}/participants`);
      if (!response.data.success) {
        throw new Error("Failed to fetch participant tasks");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Action to get feedback list for a program
export const fetchFeedbackList = createAsyncThunk(
  "feedbackList/get",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(`${FEEDBACK_API.LIST}?program_id=${programId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch feedback list");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to add feedback
export const addFeedback = createAsyncThunk(
  "feedback/add",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await programApiClient.post(FEEDBACK_API.ADD, feedbackData);
      if (!response.data.success) {
        throw new Error("Failed to add feedback");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateProgramStatus = createAsyncThunk(
  "program/updateStatus",
  async ({ publicId, status }, { rejectWithValue }) => { 
    try {
      const response = await programApiClient.patch(
        `${PROGRAM_API.UPDATE_STATUS}${publicId}/status/${status}`
      );
      if (!response.data.success) {
        throw new Error("Failed to update program status");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to fetch program details by ID
export const fetchProgramDetails = createAsyncThunk(
  "program/fetchDetails",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await programApiClient.get(`${PROGRAM_API.DETAILS}${programId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch program details");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteProgram = createAsyncThunk(
  "training/deleteProgram",
  async (publicId, { rejectWithValue }) => {
    try {
      await programApiClient.delete(FEEDBACK_API.DELETE(publicId));
      return publicId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateProgramDetails = createAsyncThunk(
  "training/updateProgramDetails",
  async ({ publicId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await programApiClient.patch(FEEDBACK_API.UPDATE(publicId), feedbackData);
      if (!response.data.success) {
        throw new Error("Failed to update program");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);