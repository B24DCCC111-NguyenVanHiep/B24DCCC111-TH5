import React from "react";
import { connect } from "umi";
import { Table } from "antd";

interface Props {
  lichhens: any[];
  dichvus: any[];
  nhanviens: any[];
}

const ThongKePage: React.FC<Props> = ({ lichhens, dichvus, nhanviens }) => {

  // thống kê số lịch theo ngày
  const lichTheoNgay: any = {};

  lichhens.forEach((item) => {
    if (!lichTheoNgay[item.date]) {
      lichTheoNgay[item.date] = 0;
    }
    lichTheoNgay[item.date]++;
  });

  const lichTable = Object.keys(lichTheoNgay).map((date) => ({
    date,
    total: lichTheoNgay[date],
  }));

  // doanh thu theo dịch vụ
  const doanhThuDichVu = dichvus.map((dv) => {
    const total = lichhens
      .filter((l) => l.serviceId === dv.id && l.status === "Hoàn thành")
      .length;

    return {
      name: dv.name,
      revenue: total * dv.price,
    };
  });

  // doanh thu theo nhân viên
  const doanhThuNhanVien = nhanviens.map((nv) => {
    const list = lichhens.filter(
      (l) => l.employeeId === nv.id && l.status === "Hoàn thành"
    );

    let revenue = 0;

    list.forEach((item) => {
      const dv = dichvus.find((d) => d.id === item.serviceId);
      if (dv) revenue += dv.price;
    });

    return {
      name: nv.name,
      revenue,
    };
  });

  return (
    <div>
      <h2>Thống kê</h2>

      <h3>Lịch hẹn theo ngày</h3>
      <Table
        rowKey="date"
        dataSource={lichTable}
        columns={[
          { title: "Ngày", dataIndex: "date" },
          { title: "Số lịch", dataIndex: "total" },
        ]}
      />

      <h3 style={{ marginTop: 40 }}>Doanh thu theo dịch vụ</h3>
      <Table
        rowKey="name"
        dataSource={doanhThuDichVu}
        columns={[
          { title: "Dịch vụ", dataIndex: "name" },
          { title: "Doanh thu", dataIndex: "revenue" },
        ]}
      />

      <h3 style={{ marginTop: 40 }}>Doanh thu theo nhân viên</h3>
      <Table
        rowKey="name"
        dataSource={doanhThuNhanVien}
        columns={[
          { title: "Nhân viên", dataIndex: "name" },
          { title: "Doanh thu", dataIndex: "revenue" },
        ]}
      />
    </div>
  );
};

export default connect(({ lichhen, dichvu, nhanvien }: any) => ({
  lichhens: lichhen.list,
  dichvus: dichvu.list,
  nhanviens: nhanvien.list,
}))(ThongKePage);