import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFeedbackList,
  addFeedback,
  createTrainingAttendance,
  fetchProgramAttendance,
  fetchUsersAbsent,
  postParticipantTask,
  fetchParticipantTasks,
  createProgram,
  fetchProgramList,
  updateParticipantTask,
  deleteParticipantTask,
  fetchParticipantsDetails,
  updateProgramStatus
} from "./programAction";

const initialState = {
  programs: [],
  feedback: [],
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
      // Fetch Feedback List
      .addCase(fetchFeedbackList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.feedback = payload;
      })
      .addCase(fetchFeedbackList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Add Feedback
      .addCase(addFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.feedback.push(payload);
      })
      .addCase(addFeedback.rejected, (state, { payload }) => {
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

      // Create Program
      .addCase(createProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgram.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.programs.push(payload);
      })
      .addCase(createProgram.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Programs
      .addCase(fetchProgramList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.programs = payload.programs;
      })
      .addCase(fetchProgramList.rejected, (state, { payload }) => {
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
      })

      .addCase(updateProgramStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgramStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.programs = state.programs.map(program =>
          program.public_id === payload.public_id ? payload : program
        );
      })
      .addCase(updateProgramStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError } = programSlice.actions;
export default programSlice.reducer;