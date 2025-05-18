import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  branchDetail: null,
  subject: null,
  dpjSb: [],
};

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setBranchDetail(state, action) {
      state.branchDetail = action.payload;
    },
    setSubject(state, action) {
      state.subject = action.payload;
    },
    setDpjSb(state, action) {
      state.dpjSb = action.payload;
    },
    clearSubject(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setBranchDetail, setSubject, setDpjSb, clearSubject } = subjectSlice.actions;
export default subjectSlice.reducer;