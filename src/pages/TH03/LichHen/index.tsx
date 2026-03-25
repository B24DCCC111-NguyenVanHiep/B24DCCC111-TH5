import React, { useState } from "react";
import { connect, Dispatch } from "umi";
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

interface LichHen {
  id: number;
  employeeId: number;
  serviceId: number;
  date: string;
  time: string;
  status: string;
}

interface Props {
  dispatch: Dispatch;
  lichhens: LichHen[];
  nhanviens: any[];
  dichvus: any[];
}

const LichHenPage: React.FC<Props> = ({
  dispatch,
  lichhens,
  nhanviens,
  dichvus,
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const openAdd = () => {
    form.resetFields();
    setOpen(true);
  };

  const remove = (id: number) => {
    dispatch({
      type: "lichhen/delete",
      payload: id,
    });
  };

  const save = async () => {
    const values = await form.validateFields();

    const date = values.date.format("YYYY-MM-DD");
    const time = values.time.format("HH:mm");

    // kiểm tra trùng lịch
    const isConflict = lichhens.some(
      (item) =>
        item.employeeId === values.employeeId &&
        item.date === date &&
        item.time === time
    );

    if (isConflict) {
      alert("Nhân viên đã có lịch vào thời gian này!");
      return;
    }

    dispatch({
      type: "lichhen/add",
      payload: {
        id: Date.now(),
        employeeId: values.employeeId,
        serviceId: values.serviceId,
        date,
        time,
        status: "Chờ duyệt",
      },
    });

    setOpen(false);
  };

  const columns = [
    {
      title: "Nhân viên",
      render: (_: any, record: LichHen) =>
        nhanviens.find((nv) => nv.id === record.employeeId)?.name,
    },
    {
      title: "Dịch vụ",
      render: (_: any, record: LichHen) =>
        dichvus.find((dv) => dv.id === record.serviceId)?.name,
    },
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Giờ",
      dataIndex: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Hành động",
      render: (_: any, record: LichHen) => (
        <Button danger onClick={() => remove(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý lịch hẹn</h2>

      <Button type="primary" onClick={openAdd}>
        Đặt lịch
      </Button>

      <Table
        columns={columns}
        dataSource={lichhens}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Đặt lịch hẹn"
        open={open}
        onOk={save}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nhân viên"
            name="employeeId"
            rules={[{ required: true }]}
          >
            <Select>
              {nhanviens.map((nv) => (
                <Select.Option key={nv.id} value={nv.id}>
                  {nv.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Dịch vụ"
            name="serviceId"
            rules={[{ required: true }]}
          >
            <Select>
              {dichvus.map((dv) => (
                <Select.Option key={dv.id} value={dv.id}>
                  {dv.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Giờ"
            name="time"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ lichhen, nhanvien, dichvu }: any) => ({
  lichhens: lichhen.list,
  nhanviens: nhanvien.list,
  dichvus: dichvu.list,
}))(LichHenPage);