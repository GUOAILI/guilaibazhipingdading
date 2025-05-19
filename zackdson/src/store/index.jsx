// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';
// import subjectReducer from './subjectSlice';
// import recordReducer from './recordSlice';
// import backupReducer from './backupSlice';

// export default configureStore({
//   reducer: {
//     user: userReducer,
//     subject: subjectReducer,
//     record: recordReducer,
//     backup: backupReducer,
//   },
// });
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用 localStorage
import userReducer from './userSlice';
import subjectReducer from './subjectSlice';
import recordReducer from './recordSlice';
import backupReducer from './backupSlice';

const persistConfig = {
  key: 'backup',
  storage,
  whitelist: ['backup'],
};

const rootReducer = combineReducers({
  user: userReducer,
  subject: subjectReducer,
  record: recordReducer,
  backup: backupReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;