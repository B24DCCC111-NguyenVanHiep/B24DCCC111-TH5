import { Button, DatePicker, Form, Input, Modal, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TinyEditor from '@/components/TinyEditor';
import { useEffect } from 'react';
import moment from 'moment';
import { Club } from '@/models/clbManagement';

interface ClubFormProps {
  visible: boolean;
  initialValue?: Club | null;
  onCancel: () => void;
  onSubmit: (value: Omit<Club, 'id' | 'createdAt'> | Club) => void;
}

const ClubForm = ({ visible, initialValue, onCancel, onSubmit }: ClubFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (initialValue) {
      form.setFieldsValue({
        ...initialValue,
        establishedAt: initialValue?.establishedAt ? moment(initialValue.establishedAt) : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ active: true });
    }
  }, [visible, initialValue]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Modal
      title={initialValue ? 'Chỉnh sửa CLB' : 'Thêm mới CLB'}
      visible={visible}
      onCancel={onCancel}
      okText={initialValue ? 'Cập nhật' : 'Thêm mới'}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit({
              ...values,
              establishedAt: values.establishedAt.toISOString(),
            });
            form.resetFields();
          })
          .catch(() => {});
      }}
      destroyOnClose
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='name' label='Tên câu lạc bộ' rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='president' label='Chủ nhiệm CLB' rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='establishedAt' label='Ngày thành lập' rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='active' label='Hoạt động' valuePropName='checked'>
          <Switch checkedChildren='Có' unCheckedChildren='Không' />
        </Form.Item>

        <Form.Item name='description' label='Mô tả (HTML)'>
          <TinyEditor height={220} />
        </Form.Item>

        <Form.Item label='Avatar CLB' name='avatar'>
          <Upload
            maxCount={1}
            listType='picture'
            beforeUpload={(file) => {
              getBase64(file).then((dataUrl) => form.setFieldsValue({ avatar: dataUrl }));
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          <Form.Item noStyle shouldUpdate={(prev, next) => prev.avatar !== next.avatar}>
            {() => (
              form.getFieldValue('avatar') ? (
                <img src={form.getFieldValue('avatar')} alt='avatar' style={{ width: 80, marginTop: 8 }} />
              ) : null
            )}
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubForm;
