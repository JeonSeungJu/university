import React from 'react';

const ConsultationPage = () => {
  return (
    <div>
      {/* 다른 페이지 내용은 여기에 들어갈 것 */}
      <div>
        <form>
          <div>
            <label htmlFor="name">성함</label>
            <input type="text" id="name" name="name" />
          </div>
          <div>
            <label htmlFor="contact">연락처</label>
            <input type="text" id="contact" name="contact" />
          </div>
          <div>
            <label htmlFor="degree">학위과정</label>
            <select id="degree" name="degree">
              {/* 학위과정 옵션들을 넣어주세요 */}
              <option value="undergraduate">학사과정</option>
              <option value="graduate">석사과정</option>
              {/* 필요한 만큼 옵션을 추가하세요 */}
            </select>
          </div>
          <div>
            <label>
              <input type="checkbox" name="agree" /> 개인정보 수집 동의
            </label>
          </div>
          <div>
            <button type="submit">제출하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationPage;
