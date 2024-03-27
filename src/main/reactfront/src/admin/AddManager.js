import React, { useState } from 'react';

const AddManager = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAddManager = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const managerData = {
      email,
      name,
      phone,
      password
    };

    try {
      const response = await fetch('http://localhost:8083/api/manager/addManager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(managerData),
      });

      if (response.ok) {
        alert('담당자가 성공적으로 추가되었습니다.');
        // 추가된 후에 필요한 작업을 수행하세요.
      } else {
        alert('담당자 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>담당자 추가</h2>
      <form onSubmit={handleAddManager}>
        <label htmlFor="email">이메일:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

        <label htmlFor="name">이름:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required /><br />

        <label htmlFor="phone">전화번호:</label>
        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br />

        <label htmlFor="password">비밀번호:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />

        <label htmlFor="confirmPassword">비밀번호 확인:</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />

        <button type="submit">추가</button>
      </form>
    </div>
  );
};

export default AddManager;
