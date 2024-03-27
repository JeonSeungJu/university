import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer'; // 예시로 authReducer를 가져왔습니다. 실제로 사용하는 리듀서로 변경해주세요.

const rootReducer = combineReducers({
  auth: authReducer,
  // 다른 리듀서가 있다면 추가하세요
});

export default rootReducer;
