import React, { useState } from "react";
import { connect, Dispatch } from "umi";
import { Table, Button, Modal, Form, Input } from "antd";

interface NhanVien {
  id: number;
  name: string;
  maxCustomerPerDay: number;
  workTime: string;
}

interface Props {
  dispatch: Dispatch;
  nhanviens: NhanVien[];
}

const NhanVienPage: React.FC<Props> = ({ dispatch, nhanviens }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NhanVien | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const edit = (record: NhanVien) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const remove = (id: number) => {
    dispatch({
      type: "nhanvien/delete",
      payload: id,
    });
  };

  const save = async () => {
    const values = await form.validateFields();

    if (editing) {
      dispatch({
        type: "nhanvien/update",
        payload: { ...editing, ...values },
      });
    } else {
      dispatch({
        type: "nhanvien/add",
        payload: {
          id: Date.now(),
          ...values,
        },
      });
    }

    setOpen(false);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Khách/ngày",
      dataIndex: "maxCustomerPerDay",
    },
    {
      title: "Lịch làm việc",
      dataIndex: "workTime",
    },
    {
      title: "Hành động",
      render: (_: any, record: NhanVien) => (
        <>
          <Button type="link" onClick={() => edit(record)}>
            Sửa
          </Button>
          <Button danger type="link" onClick={() => remove(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      <Button type="primary" onClick={openAdd}>
        Thêm nhân viên
      </Button>

      <Table
        columns={columns}
        dataSource={nhanviens}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Nhân viên"
        open={open}
        onOk={save}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số khách/ngày"
            name="maxCustomerPerDay"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Lịch làm việc"
            name="workTime"
            rules={[{ required: true }]}
          >
            <Input placeholder="9:00 - 17:00" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ nhanvien }: any) => ({
  nhanviens: nhanvien.list,
}))(NhanVienPage);