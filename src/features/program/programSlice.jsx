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
  updateParticipantTask,
  deleteParticipantTask,
  fetchParticipantsDetails
} from "./programAction";

const initialState = {
  trainingFeedback: [],
  attendance: [],
  absentUsers: [],
  participantTasks: {
    participants: []
  },
  loading: false,
  error: null,
  participantsDetails: {
    data: [],
    totalCount: 0,
    loading: false,
    error: null
  }
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        const participantIndex = state.participantTasks.participants.findIndex(
          p => p.id === payload.participantId
        );
        if (participantIndex !== -1) {
          if (!state.participantTasks.participants[participantIndex].tasks) {
            state.participantTasks.participants[participantIndex].tasks = [];
          }
          state.participantTasks.participants[participantIndex].tasks.unshift(payload);
        }
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
        state.participantTasks.participants = payload?.data?.participants || [];
      })
      .addCase(fetchParticipantTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Participant Task
      .addCase(updateParticipantTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticipantTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        for (const participant of state.participantTasks.participants) {
          if (participant.tasks) {
            const taskIndex = participant.tasks.findIndex(
              t => t.id === payload.id
            );
            if (taskIndex !== -1) {
              participant.tasks[taskIndex] = payload;
              break;
            }
          }
        }
      })
      .addCase(updateParticipantTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Participant Task
      .addCase(deleteParticipantTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParticipantTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        for (const participant of state.participantTasks.participants) {
          if (participant.tasks) {
            participant.tasks = participant.tasks.filter(t => t.id !== payload);
          }
        }
      })
      .addCase(deleteParticipantTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(fetchParticipantsDetails.pending, (state) => {
        state.participantsDetails.loading = true;
        state.participantsDetails.error = null;
      })
      .addCase(fetchParticipantsDetails.fulfilled, (state, { payload }) => {
        state.participantsDetails.loading = false;
        state.participantsDetails.data = payload.data.participants;
        state.participantsDetails.totalCount = payload.data.totalCount;
      })
      .addCase(fetchParticipantsDetails.rejected, (state, { payload }) => {
        state.participantsDetails.loading = false;
        state.participantsDetails.error = payload;
      });
  }
});

export const { clearError } = programSlice.actions;
export default programSlice.reducer;