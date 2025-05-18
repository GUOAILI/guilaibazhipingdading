import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subjectReducer from './subjectSlice';
import recordReducer from './recordSlice';
import backupReducer from './backupSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    subject: subjectReducer,
    record: recordReducer,
    backup: backupReducer,
  },
});