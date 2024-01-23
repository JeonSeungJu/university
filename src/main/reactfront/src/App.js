// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import ConsultationSection from './components/ConsultationSection';
import Signup from './Members/Signup';
import Login from './Members/Login';
import MainPage from './main/MainPage';
import BoardList from './main/BoardList';
import BoardForm from './main/BoardForm';
import BoardDetail from './main/BoardDetail';

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <TopNavbar />
          <BottomNavbar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainPage />} />
            <Route path="consultation" element={<BoardList/>} />
            <Route path="BoardForm" element={<BoardForm/>} />
            <Route path="BoardDetail" element={<BoardDetail/>} />
            {/* 다른 페이지에 대한 Route 정의 */}
          </Routes>
          <ConsultationSection />
        </div>
      </Router>
    </Provider>
  );
}

export default App;