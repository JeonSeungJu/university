import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import ConsultationSection from './components/ConsultationSection';
import ConsultationPage from './components/ConsultationPage';
import Signup from './Members/Signup';
import Login from './Members/Login';
import MainPage from './page/MainPage';
import BoardList from './page/BoardList';
import BoardForm from './page/BoardForm';
import BoardDetail from './page/BoardDetail';
import NoticeList from './page/NoticeList';
import NoticePage from './page/NoticePage';
import ReviewDetail from './page/review/ReviewDetail';
import ReviewList from './page/review/ReviewList';
import AdminNavbar from './admin/AdminNavbar'; // 추가: AdminDashboard import
import AddManager from './admin/AddManager'; // 추가: AdminDashboard import
import AdminComponent from './admin/AdminComponent'; // 추가: AdminDashboard import
import AdminComponentMember from './admin/AdminComponentMember';
import AdminBoardList from './admin/board/AdminBoardList';
import AdminBoardDetail from './admin/board/AdminBoardDetail';
import AdminNoticeBoard from './admin/AdminNoticeBoard';
import AdminNoticeForm from './admin/AdminNoticeForm';
import AdminNoticePage from './admin/AdminNoticePage';
import AdminReviewList from './admin/review/AdminReviewList';
import AdminReviewForm from './admin/review/AdminReviewForm';
import AdminReviewDetail from './admin/review/AdminReviewDetail';
import AdminColumnList from './admin/column/AdminColumnList';
import AdminColumnForm from './admin/column/AdminColumnForm';

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // 여기서 사용자 역할 정보를 가져오는 API 호출 또는 다른 방법으로 설정
    // 사용자가 로그인하지 않은 경우 빈 문자열로 설정
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      try {
        const decodedToken = atob(storedToken.split('.')[1]);
        const role = JSON.parse(decodedToken).role;
        setUserRole(role);
      } catch (error) {
        console.error('토큰 디코딩 중 오류 발생', error);
      }
    } else {
      setUserRole(''); // 또는 다른 초기값으로 설정 가능
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* 역할에 따라 다르게 렌더링되는 탑 네비게이션 바 */}
          {userRole === 'ROLE_USER' || userRole === '' ? (
            <TopNavbar />
          ) : null}
          {userRole === 'ROLE_ADMIN' ? <AdminNavbar /> : <BottomNavbar />}
          <Routes>
            {userRole === 'ROLE_USER' || userRole === '' ? (
              <>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainPage />} />
                <Route path="consultation" element={<BoardList />} />
                <Route path="boardForm" element={<BoardForm />} />
                <Route path="boardDetail/:id" element={<BoardDetail />} />
                <Route path="notice" element={<NoticeList />} />
                <Route path="noticeDetail/:id" element={<NoticePage />} />
                <Route path="review" element={<ReviewList />} />
                <Route path="reviewDetail/:id" element={<ReviewDetail />} />
              </>
            ) : null}
            {userRole === 'ROLE_ADMIN' && (
             <>
             <Route path="/" element={<AdminComponent />} />
             <Route path="/addManager" element={<AddManager />} />
             <Route path="/adminComponentMember" element={<AdminComponentMember />} />
             <Route path="/adminBoardList" element={<AdminBoardList />} />
             <Route path="/adminBoardDetail/:id" element={<AdminBoardDetail />} />
             <Route path="/notice" element={<AdminNoticeBoard />} />
             <Route path="/noticeform" element={<AdminNoticeForm />} />
             <Route path="/noticeDetail/:id" element={<AdminNoticePage />} />
             <Route path="/review/" element={<AdminReviewList />} />
             <Route path="/reviewform/" element={<AdminReviewForm />} />
             <Route path="/review-detail/:id" element={<AdminReviewDetail />} />
             <Route path="/column/" element={<AdminColumnList />} />
             <Route path="/columnform/" element={<AdminColumnForm />} />
             
           </>
            )}
          </Routes>
          {userRole === 'ROLE_USER' || userRole === '' ? (
            <ConsultationSection />
          ) : null}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
