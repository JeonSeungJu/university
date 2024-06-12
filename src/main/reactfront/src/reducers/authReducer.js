import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('로그인 성공 액션 디스패치');
      // 여기에서 추가적인 로직을 확인
      console.log('새로운 상태:', {
        ...state,
        isLoggedIn: true,
      });

      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGOUT:
      console.log('로그아웃 액션 디스패치');
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
export default authReducer;
