import { createSlice } from "@reduxjs/toolkit";
import {
  createInternTask,
  fetchInternTask,
  deleteInternTask
} from "./internTaskAction";

const initialState = {
  interntask: [],
  taskDetails: null,
  loading: false,
  error: null,
  internTaskCache: null
};

const isInternDetailsDifferent = (current, incoming) => {
  if (!current || !incoming) return true;
  const comparableFields = ["title", "description", "deadline", "status", "feedback"];
  return comparableFields.some(field => current[field] !== incoming[field]);
};

const internTaskSlice = createSlice({
  name: "internTask",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInternTaskDetails: (state) => {
      state.taskDetails = null;
    },
    cacheInternTaskDetails: (state, action) => {
      if (!state.internTaskCache) state.internTaskCache = {};
      state.internTaskCache[action.payload.publicId] = action.payload;
    },
    updateInternTaskList: (state, action) => {
      state.interntask = action.payload.map(intern => ({
    }));
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Intern
      .addCase(createInternTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInternTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createInternTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Interns
      .addCase(fetchInternTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.interntask = payload?.map(task => ({
          id: task.id,
          internId: task.internId,
          title: task.title,
          description: task.description,
          feedback: task.feedback,
          deadline: task.deadline,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }));
      })
      .addCase(fetchInternTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })


      // Delete Intern
      .addCase(deleteInternTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInternTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteInternTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, resetInternTaskDetails, cacheInternTaskDetails, updateInternTaskList } = internTaskSlice.actions;
export default internTaskSlice.reducer;
