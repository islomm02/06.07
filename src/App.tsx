import { useState } from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  message,
  Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { createStack, deleteStack, getStacks, updateStack } from './services/querys';

const { Title } = Typography;

const TantaskList = () => {
  const queryClient = useQueryClient();

  const { data: stacks = [], isLoading } = useQuery({
    queryKey: ['stacks'],
    queryFn: getStacks,
  });

  const createMutation = useMutation({
    mutationFn: createStack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stacks'] });
      message.success("Yangi stack qo'shildi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stacks'] });
      message.success("Stack yangilandi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stacks'] });
      message.success("Stack o'chirildi");
    },
  });

  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate({ name: newName });
    setNewName('');
  };

  const handleUpdate = () => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, name: editing.name });
      setEditing(null);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Haqiqatan o‘chirmoqchimisiz?',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Nomi',
      dataIndex: 'name',
    },
    {
      title: 'Amallar',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => setEditing(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>📦 Tantask Stacks</Title>

      <Space style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Stack nomi"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Qo‘shish
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={stacks}
        rowKey="id"
        loading={isLoading}
        bordered
      />

      <Modal
        title="Stackni tahrirlash"
        open={!!editing}
        onOk={handleUpdate}
        onCancel={() => setEditing(null)}
        okText="Saqlash"
        cancelText="Bekor"
      >
        <Input
          value={editing?.name}
          onChange={(e) =>
            setEditing({ ...editing!, name: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default TantaskList;
