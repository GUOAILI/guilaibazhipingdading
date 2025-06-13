import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastBackupTip: undefined,
  lastUseTip: undefined,
  // lastBackupTip: null,
  // lastUseTip: null,
};

const backupSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    setBackupTip(state, action) {
      state.lastBackupTip = action.payload;
    },
    setUseTip(state, action) {
      state.lastUseTip = action.payload;
    },
    clearBackup(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setBackupTip, setUseTip, clearBackup } = backupSlice.actions;
export default backupSlice.reducer;