import React, { useState } from "react";
import { connect, Dispatch } from "umi";
import { Table, Button, Modal, Form, Input } from "antd";

interface DichVu {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Props {
  dispatch: Dispatch;
  dichvus: DichVu[];
}

const DichVuPage: React.FC<Props> = ({ dispatch, dichvus }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DichVu | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const edit = (record: DichVu) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const remove = (id: number) => {
    dispatch({
      type: "dichvu/delete",
      payload: id,
    });
  };

  const save = async () => {
    const values = await form.validateFields();

    if (editing) {
      dispatch({
        type: "dichvu/update",
        payload: { ...editing, ...values },
      });
    } else {
      dispatch({
        type: "dichvu/add",
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
      title: "Tên dịch vụ",
      dataIndex: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "duration",
    },
    {
      title: "Hành động",
      render: (_: any, record: DichVu) => (
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
      <h2>Quản lý dịch vụ</h2>

      <Button type="primary" onClick={openAdd}>
        Thêm dịch vụ
      </Button>

      <Table
        columns={columns}
        dataSource={dichvus}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Dịch vụ"
        open={open}
        onOk={save}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Thời gian thực hiện (phút)"
            name="duration"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ dichvu }: any) => ({
  dichvus: dichvu.list,
}))(DichVuPage);