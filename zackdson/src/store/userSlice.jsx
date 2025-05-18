import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  long: null,
  expiration: null,
  username: null,
  school: null,
  grade: null,
  resetGrade: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      Object.assign(state, action.payload);
    },
    clearUserInfo(state) {
      Object.assign(state, initialState);
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setLong(state, action) {
      state.long = action.payload;
    },
    setExpiration(state, action) {
      state.expiration = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setSchool(state, action) {
      state.school = action.payload;
    },
    setGrade(state, action) {
      state.grade = action.payload;
    },
    setResetGrade(state, action) {
      state.resetGrade = action.payload;
    },
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  setToken,
  setLong,
  setExpiration,
  setUsername,
  setSchool,
  setGrade,
  setResetGrade,
} = userSlice.actions;

export default userSlice.reducer;