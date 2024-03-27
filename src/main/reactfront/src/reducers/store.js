// store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import { rootReducer } from './reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  // 다른 리듀서가 있다면 추가하세요
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
