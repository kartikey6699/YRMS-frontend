import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTrainingFeedback,
  addTrainingFeedback,
  updateTrainingFeedback,
  deleteTrainingFeedback,
  createTrainingAttendance,
  fetchProgramAttendance,
  fetchUsersAbsent,
  postParticipantTask,
  fetchParticipantTasks,
  fetchParticipantTaskDetails
} from "./programAction";

const initialState = {
  trainingFeedback: [],
  attendance: [],
  participantTasks: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    size: 10
  }
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.size = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when page size changes
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Training Feedback
      .addCase(fetchTrainingFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.trainingFeedback = payload;
      })
      .addCase(fetchTrainingFeedback.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Add Training Feedback
      .addCase(addTrainingFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrainingFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.trainingFeedback.push(payload);
      })
      .addCase(addTrainingFeedback.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Training Feedback
      .addCase(updateTrainingFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrainingFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.trainingFeedback.findIndex(f => f.publicId === payload.publicId);
        if (index !== -1) {
          state.trainingFeedback[index] = payload;
        }
      })
      .addCase(updateTrainingFeedback.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Training Feedback
      .addCase(deleteTrainingFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrainingFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.trainingFeedback = state.trainingFeedback.filter(f => f.publicId !== payload);
      })
      .addCase(deleteTrainingFeedback.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Create Training Attendance
      .addCase(createTrainingAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrainingAttendance.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendance.push(payload);
      })
      .addCase(createTrainingAttendance.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Program Attendance
      .addCase(fetchProgramAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramAttendance.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendance = payload;
      })
      .addCase(fetchProgramAttendance.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Users Absent
      .addCase(fetchUsersAbsent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAbsent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.absentUsers = payload;
      })
      .addCase(fetchUsersAbsent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Post Participant Task
      .addCase(postParticipantTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postParticipantTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.participantTasks.push(payload);
      })
      .addCase(postParticipantTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Participant Tasks
      .addCase(fetchParticipantTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.participantTasks = payload;
      })
      .addCase(fetchParticipantTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Participant Task Details
      .addCase(fetchParticipantTaskDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantTaskDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.participantTasks.findIndex(t => t.publicId === payload.publicId);
        if (index !== -1) {
          state.participantTasks[index] = payload;
        }
      })
      .addCase(fetchParticipantTaskDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, setPage, setPageSize } = programSlice.actions;
export default programSlice.reducer;
