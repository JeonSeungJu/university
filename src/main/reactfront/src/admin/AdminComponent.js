import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'antd';

const ConfirmModal = ({ visible, onConfirm, onCancel, title, content }) => (
  <Modal title={title} visible={visible} onOk={onConfirm} onCancel={onCancel}>
    {content}
  </Modal>
);

const AcceptButton = ({ userId, onClick }) => (
  <Button onClick={() => onClick(userId)}>수락</Button>
);

const RejectButton = ({ userId, onClick }) => (
  <Button onClick={() => onClick(userId)}>삭제</Button>
);

const AdminComponent = () => {
  const [temporaryUsers, setTemporaryUsers] = useState([]);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    fetchTemporaryUsers();
  }, []);

  const fetchTemporaryUsers = async () => {
    try {
      const response = await axios.post('http://3.106.45.125:8080/api/manager/temporary', {});
      setTemporaryUsers(response.data);
    } catch (error) {
      console.error('Error fetching temporary users:', error);
    }
  };

  const showConfirmationModal = (userId, title, content) => {
    setSelectedUserId(userId);
    setModalTitle(title);
    setModalContent(content);

    if (title === '동작 확인') {
      setAcceptModalVisible(true);
    } else if (title === '삭제 확인') {
      setRejectModalVisible(true);
    }
  };

  const handleAccept = (userId) => {
    showConfirmationModal(userId, '동작 확인', `정말로 사용자 ID ${userId}에 대한 동작을 수락하시겠습니까?`);
    console.log("수락 버튼이 눌렸습니다. 사용자 ID:", userId);
  };

  const handleReject = (userId) => {
    showConfirmationModal(userId, '삭제 확인', `정말로 사용자 ID ${userId}에 대한 동작을 삭제하시겠습니까?`);
    console.log("삭제 버튼이 눌렸습니다. 사용자 ID:", userId);
  };

  const handleConfirm = async (actionType) => {
    try {
      const email = temporaryUsers.find((user) => user.id === selectedUserId)?.email;
      const url = actionType === 'accept' ? 'http://3.106.45.125:8080/api/manager/accept-user' : 'http://3.106.45.125:8080/api/manager/reject-user';

      await axios.post(url, {
        email: email,
      }).then(response => {
        console.log(response.data);
        console.log(`${actionType} 동작이 확인되었습니다.`);
        console.log("응답 데이터:", response.data);
        fetchTemporaryUsers();
      });
    } catch (error) {
      console.error(`Error confirming ${actionType} action:`, error);
    } finally {
      setAcceptModalVisible(false);
      setRejectModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setAcceptModalVisible(false);
    setRejectModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
            <AcceptButton userId={record.id} onClick={handleAccept} />
            <RejectButton userId={record.id} onClick={handleReject} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>임시 사용자 목록</h1>
      <Table dataSource={temporaryUsers} columns={columns} />
      <ConfirmModal
        visible={acceptModalVisible}
        onConfirm={() => handleConfirm('accept')}
        onCancel={handleModalCancel}
        title={modalTitle}
        content={modalContent}
      />
      <ConfirmModal
        visible={rejectModalVisible}
        onConfirm={() => handleConfirm('reject')}
        onCancel={handleModalCancel}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
};

export default AdminComponent;
