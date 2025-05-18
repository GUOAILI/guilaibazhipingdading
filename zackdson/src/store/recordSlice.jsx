import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notebookRecord: null,
  writingRecord: null,
  commonRecord: null,
  wrongRecord: null,
  examRecord: null,
  reviewRecord: null,
  extensionRecord: null,
};

const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setRecord(state, action) {
      const { type, value } = action.payload;
      state[type] = value;
    },
    clearRecords(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setRecord, clearRecords } = recordSlice.actions;
export default recordSlice.reducer;