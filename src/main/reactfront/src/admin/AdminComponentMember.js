import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, Form } from 'antd';

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

const EditButton = ({ userId, onClick }) => (
  <Button onClick={() => onClick(userId)}>수정</Button>
);

const EditModal = ({ visible, user, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user, form]);

  return (
    <Modal
      title="사용자 정보 수정"
      visible={visible}
      onOk={() => {
        form.validateFields()
          .then(values => {
            onSave(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AdminComponent = () => {
  const [temporaryUsers, setTemporaryUsers] = useState([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchTemporaryUsers();
  }, []);

  const fetchTemporaryUsers = async () => {
    try {
      const response = await axios.post('http://13.237.172.212:8080/api/manager/members', {});
      setTemporaryUsers(response.data);
    } catch (error) {
      console.error('Error fetching temporary users:', error);
    }
  };

  const showConfirmationModal = (userId, title, content) => {
    setSelectedUserId(userId);
    setModalTitle(title);
    setModalContent(content);
    setRejectModalVisible(true);
  };

  const handleReject = (userId) => {
    showConfirmationModal(userId, '삭제 확인', `정말로 사용자 ID ${userId}에 대한 동작을 삭제하시겠습니까?`);
    console.log("삭제 버튼이 눌렸습니다. 사용자 ID:", userId);
  };

  const handleConfirm = async (actionType) => {
    try {
      const email = temporaryUsers.find((user) => user.id === selectedUserId)?.email;
      const url = actionType === 'reject' ? 'http://13.237.172.212:8080/api/manager/member-drop' : '';

      await axios.post(url, { email: email })
        .then(response => {
          console.log(response.data);
          console.log(`${actionType} 동작이 확인되었습니다.`);
          console.log("응답 데이터:", response.data);
          fetchTemporaryUsers();
        });
    } catch (error) {
      console.error(`Error confirming ${actionType} action:`, error);
    } finally {
      setRejectModalVisible(false);
    }
  };

  const handleEdit = (userId) => {
    const user = temporaryUsers.find(user => user.id === userId);
    setEditingUser(user);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (user) => {
    try {
      await axios.post('http://13.237.172.212:8080/api/manager/update-member', user);
      console.log('사용자 정보가 수정되었습니다.');
      fetchTemporaryUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setEditModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setRejectModalVisible(false);
    setEditModalVisible(false);
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
          <RejectButton userId={record.id} onClick={handleReject} />
          <EditButton userId={record.id} onClick={handleEdit} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>사용자 목록</h1>
      <Table dataSource={temporaryUsers} columns={columns} />
      <ConfirmModal
        visible={rejectModalVisible}
        onConfirm={() => handleConfirm('reject')}
        onCancel={handleModalCancel}
        title={modalTitle}
        content={modalContent}
      />
      <EditModal
        visible={editModalVisible}
        user={editingUser}
        onSave={handleSaveEdit}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default AdminComponent;