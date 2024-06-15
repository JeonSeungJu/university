import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import ConsultationSection from './components/ConsultationSection';
import InformationSection from './components/InformationSection';
import Signup from './Members/Signup';
import Login from './Members/Login';
import MainPage from './page/MainPage';
import BoardList from './Members/board/BoardList';
import BoardForm from './Members/board/BoardForm';
import BoardDetail from './Members/board/BoardDetail';
import NoticeList from './Members/notice/NoticeList';
import NoticePage from './Members/notice/NoticePage';
import ReviewDetail from './Members/review/ReviewDetail';
import ReviewForm from './Members/review/ReviewForm';
import ReviewList from './Members/review/ReviewList';
import ColumnDetail from './Members/column/ColumnDetail';
import ColumnList from './Members/column/ColumnList';
import AdminNavbar from './admin/AdminNavbar';
import AdminComponent from './admin/AdminComponent';
import AdminComponentMember from './admin/AdminComponentMember';
import AdminBoardList from './admin/board/AdminBoardList';
import AdminBoardDetail from './admin/board/AdminBoardDetail';
import AdminNoticeBoard from './admin/AdminNoticeBoard';
import AdminNoticeForm from './admin/AdminNoticeForm';
import AdminNoticePage from './admin/AdminNoticePage';
import AdminNoticeEdit from './admin/AdminNoticeEdit';
import AdminReviewList from './admin/review/AdminReviewList';
import AdminReviewForm from './admin/review/AdminReviewForm';
import AdminReviewDetail from './admin/review/AdminReviewDetail';
import AdminReviewEdit from './admin/review/AdminReviewEdit';
import AdminColumnForm from './admin/column/AdminColumnForm';
import AdminColumnList from './admin/column/AdminColumnList';
import AdminColumnDetail from './admin/column/AdminColumnDetail';

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
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
      setUserRole('');
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {userRole === 'ROLE_USER' || userRole === '' ? <TopNavbar /> : null}
          {userRole === 'ROLE_ADMIN' ? <AdminNavbar /> : <BottomNavbar />}
          <Routes>
            {userRole === 'ROLE_USER' || userRole === '' ? (
              <>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/consultation" element={<BoardList />} />
                <Route path="/boardForm" element={<BoardForm />} />
                <Route path="/boardDetail/:id" element={<BoardDetail />} />
                <Route path="/notice" element={<NoticeList />} />
                <Route path="/noticeDetail/:id" element={<NoticePage />} />
                <Route path="/review" element={<ReviewList />} />
                <Route path="/reviewForm" element={<ReviewForm />} />
                <Route path="/reviewdetail/:id" element={<ReviewDetail />} />
                <Route path="/column" element={<ColumnList />} />
                <Route path="/columndetail/:id" element={<ColumnDetail />} />
                <Route path="/information" element={<InformationSection />} />
              </>
            ) : null}
            {userRole === 'ROLE_ADMIN' && (
              <>
                <Route path="/" element={<AdminComponent />} />
                <Route path="/adminComponentMember" element={<AdminComponentMember />} />
                <Route path="/board" element={<AdminBoardList />} />
                <Route path="/boardDetail/:id" element={<AdminBoardDetail />} />
                <Route path="/notice" element={<AdminNoticeBoard />} />
                <Route path="/noticeform" element={<AdminNoticeForm />} />
                <Route path="/noticeDetail/:id" element={<AdminNoticePage />} />
                <Route path="/noticeEdit/:id" element={<AdminNoticeEdit />} />
                <Route path="/review" element={<AdminReviewList />} />
                <Route path="/reviewForm" element={<AdminReviewForm />} />
                <Route path="/reviewdetail/:id" element={<AdminReviewDetail />} />
                <Route path="/reviewEdit/:id" element={<AdminReviewEdit />} />
                <Route path="/columnForm" element={<AdminColumnForm />} />
                <Route path="/column" element={<AdminColumnList />} />
                <Route path="/columndetail/:id" element={<AdminColumnDetail />} />
              </>
            )}
          </Routes>
          {userRole === 'ROLE_USER' || userRole === '' ? (
            <>
              <ConsultationSection />
              <InformationSection />
            </>
          ) : null}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
