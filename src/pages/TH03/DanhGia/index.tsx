import React, { useState } from "react";
import { connect, Dispatch } from "umi";
import { Table, Button, Modal, Form, Select, Input, Rate } from "antd";

const { TextArea } = Input;

interface DanhGia {
  id: number;
  employeeId: number;
  rating: number;
  comment: string;
  reply?: string;
}

interface Props {
  dispatch: Dispatch;
  danhgias: DanhGia[];
  nhanviens: any[];
}

const DanhGiaPage: React.FC<Props> = ({ dispatch, danhgias, nhanviens }) => {
  const [open, setOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [current, setCurrent] = useState<DanhGia | null>(null);
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();

  const openAdd = () => {
    form.resetFields();
    setOpen(true);
  };

  const save = async () => {
    const values = await form.validateFields();

    dispatch({
      type: "danhgia/add",
      payload: {
        id: Date.now(),
        ...values,
      },
    });

    setOpen(false);
  };

  const openReply = (record: DanhGia) => {
    setCurrent(record);
    setReplyOpen(true);
  };

  const saveReply = async () => {
    const values = await replyForm.validateFields();

    dispatch({
      type: "danhgia/reply",
      payload: {
        id: current?.id,
        reply: values.reply,
      },
    });

    setReplyOpen(false);
  };

  const remove = (id: number) => {
    dispatch({
      type: "danhgia/delete",
      payload: id,
    });
  };

  const columns = [
    {
      title: "Nhân viên",
      render: (_: any, record: DanhGia) =>
        nhanviens.find((nv) => nv.id === record.employeeId)?.name,
    },
    {
      title: "Đánh giá",
      render: (_: any, record: DanhGia) => <Rate disabled value={record.rating} />,
    },
    {
      title: "Nhận xét",
      dataIndex: "comment",
    },
    {
      title: "Phản hồi",
      dataIndex: "reply",
    },
    {
      title: "Hành động",
      render: (_: any, record: DanhGia) => (
        <>
          <Button type="link" onClick={() => openReply(record)}>
            Phản hồi
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
      <h2>Đánh giá dịch vụ</h2>

      <Button type="primary" onClick={openAdd}>
        Thêm đánh giá
      </Button>

      <Table
        columns={columns}
        dataSource={danhgias}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal title="Đánh giá" open={open} onOk={save} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
            <Select>
              {nhanviens.map((nv) => (
                <Select.Option key={nv.id} value={nv.id}>
                  {nv.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="rating" label="Số sao" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>

          <Form.Item name="comment" label="Nhận xét">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Phản hồi đánh giá"
        open={replyOpen}
        onOk={saveReply}
        onCancel={() => setReplyOpen(false)}
      >
        <Form form={replyForm} layout="vertical">
          <Form.Item name="reply" label="Nội dung phản hồi" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ danhgia, nhanvien }: any) => ({
  danhgias: danhgia.list,
  nhanviens: nhanvien.list,
}))(DanhGiaPage);