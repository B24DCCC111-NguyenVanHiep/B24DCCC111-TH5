import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Registration } from '@/models/clbManagement';

interface RegistrationFormProps {
  visible: boolean;
  initialValue?: Registration | null;
  clubs: { id: string; name: string }[];
  onCancel: () => void;
  onSubmit: (value: Omit<Registration, 'id' | 'history' | 'status' | 'createdAt' | 'updatedAt' | 'note'> & Partial<Registration>) => void;
}

const RegistrationForm = ({ visible, initialValue, clubs, onCancel, onSubmit }: RegistrationFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (initialValue) {
      form.setFieldsValue(initialValue);
    } else {
      form.resetFields();
    }
  }, [visible, initialValue]);

  return (
    <Modal
      title={initialValue ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
      visible={visible}
      onCancel={onCancel}
      okText={initialValue ? 'Cập nhật' : 'Thêm mới'}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values as any);
            form.resetFields();
          })
          .catch(() => {});
      }}
      destroyOnClose
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='name' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='phone' label='SĐT' rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='gender' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
          <Select options={[{ value: 'Nam', label: 'Nam' }, { value: 'Nữ', label: 'Nữ' }, { value: 'Khác', label: 'Khác' }]} />
        </Form.Item>
        <Form.Item name='address' label='Địa chỉ'>
          <Input />
        </Form.Item>
        <Form.Item name='skills' label='Sở trường'>
          <Input />
        </Form.Item>
        <Form.Item name='clubId' label='Câu lạc bộ' rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
          <Select options={clubs.map((club) => ({ value: club.id, label: club.name }))} />
        </Form.Item>
        <Form.Item name='reason' label='Lý do đăng ký'>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationForm;
