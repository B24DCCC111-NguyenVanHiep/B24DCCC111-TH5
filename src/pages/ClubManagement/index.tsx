import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined, UserSwitchOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import { useModel } from 'umi';
import { Club, Member, Registration } from '@/models/clbManagement';
import { Button, Card, Col, Dropdown, Menu, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import ClubForm from './components/ClubForm';
import RegistrationForm from './components/RegistrationForm';

const { TabPane } = Tabs;

const ClubManagement = () => {
  const {
    clubs,
    registrations,
    members,
    addClub,
    updateClub,
    deleteClub,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    updateRegistrationStatus,
    bulkUpdateRegistrationStatus,
    updateMember,
    deleteMember,
    transferMembers,
    exportMembersAsXlsx,
    conversion,
  } = useModel('clbManagement');

  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [clubEditing, setClubEditing] = useState<Club | null>(null);

  const [regModalVisible, setRegModalVisible] = useState(false);
  const [regEditing, setRegEditing] = useState<Registration | null>(null);
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferTargetClub, setTransferTargetClub] = useState<string>();

  const [memberListModalVisible, setMemberListModalVisible] = useState(false);
  const [memberListClub, setMemberListClub] = useState<Club | null>(null);

  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyItem, setHistoryItem] = useState<Registration | null>(null);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectCandidate, setRejectCandidate] = useState<Registration | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const [bulkRejectModalVisible, setBulkRejectModalVisible] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState<string>('');

  const stats = useMemo(() => {
    return conversion;
  }, [conversion]);

  const clubsById = useMemo(() => new Map(clubs.map((c) => [c.id, c.name])), [clubs]);

  const clubColumns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => (
        <img src={avatar || 'https://via.placeholder.com/60'} alt='avatar' style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
      ),
      width: 90,
    },
    { title: 'Tên CLB', dataIndex: 'name', key: 'name', sorter: (a: Club, b: Club) => a.name.localeCompare(b.name) },
    {
      title: 'Ngày thành lập',
      dataIndex: 'establishedAt',
      key: 'establishedAt',
      sorter: (a: Club, b: Club) => new Date(a.establishedAt).getTime() - new Date(b.establishedAt).getTime(),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (value: string) => <div dangerouslySetInnerHTML={{ __html: value || '<i>Chưa cập nhật</i>' }} />, 
      ellipsis: true,
    },
    { title: 'Chủ nhiệm CLB', dataIndex: 'president', key: 'president' },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: Club) => record.active === value,
      render: (active: boolean) => (active ? <Tag color='green'>Có</Tag> : <Tag color='red'>Không</Tag>),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (record: Club) => (
        <Dropdown
          placement='bottomRight'
          getPopupContainer={(triggerNode) => (triggerNode?.parentElement as HTMLElement) || document.body}
          overlay={
            <Menu>
              <Menu.Item
                key='members'
                icon={<EyeOutlined />}
                onClick={() => {
                  setMemberListClub(record);
                  setMemberListModalVisible(true);
                }}
              >
                Thành viên
              </Menu.Item>
              <Menu.Item
                key='edit'
                icon={<EditOutlined />}
                onClick={() => {
                  setClubEditing(record);
                  setClubModalVisible(true);
                }}
              >
                Sửa
              </Menu.Item>
              <Menu.Item key='delete' danger icon={<DeleteOutlined />}>
                <Popconfirm title='Xóa CLB?' onConfirm={() => deleteClub(record.id)}>
                  Xóa
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type='link' icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const registrationColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', sorter: (a: Registration, b: Registration) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (id: string) => clubsById.get(id) || 'Đã xóa',
      filters: clubs.map((c) => ({ text: c.name, value: c.id })),
      onFilter: (value: any, record: Registration) => record.clubId === value,
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Registration) => record.status === value,
      render: (status: string) => {
        const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (record: Registration) => (
        <Dropdown
          overlay={
            <Menu>
              {record.status === 'Pending' ? (
                <>
                  <Menu.Item
                    key='approve'
                    icon={<CheckCircleOutlined />}
                    onClick={() => updateRegistrationStatus(record.id, 'Approved')}
                  >
                    Duyệt
                  </Menu.Item>
                  <Menu.Item
                    key='reject'
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setRejectCandidate(record);
                      setRejectReason('');
                      setRejectModalVisible(true);
                    }}
                  >
                    Từ chối
                  </Menu.Item>
                </>
              ) : null}
              <Menu.Item
                key='history'
                icon={<EyeOutlined />}
                onClick={() => {
                  setHistoryItem(record);
                  setHistoryModalVisible(true);
                }}
              >
                Lịch sử
              </Menu.Item>
              <Menu.Item
                key='edit'
                icon={<EditOutlined />}
                onClick={() => {
                  setRegEditing(record);
                  setRegModalVisible(true);
                }}
              >
                Sửa
              </Menu.Item>
              <Menu.Item key='delete' danger>
                <Popconfirm title='Xóa đơn?' onConfirm={() => deleteRegistration(record.id)}>
                  Xóa
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type='link' icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const memberColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', sorter: (a: Member, b: Member) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (id: string) => clubsById.get(id) || 'Không xác định',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (record: Member) => (
        <Dropdown
          placement='bottomRight'
          overlay={
            <Menu>
              <Menu.Item
                key='transfer'
                icon={<UserSwitchOutlined />}
                onClick={() => {
                  setSelectedMembers([record.id]);
                  setTransferModalVisible(true);
                }}
              >
                Thay CLB
              </Menu.Item>
              <Menu.Item key='delete' danger icon={<DeleteOutlined />}>
                <Popconfirm title='Xóa thành viên?' onConfirm={() => deleteMember(record.id)}>
                  Xóa
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type='link' icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography.Title level={2}>Quản lý Câu lạc bộ và Thành viên</Typography.Title>

      <Tabs defaultActiveKey='clubs'>
        <TabPane tab='CLB' key='clubs'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setClubEditing(null);
              setClubModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Thêm CLB
          </Button>

          <Table rowKey='id' dataSource={clubs} columns={clubColumns} pagination={{ pageSize: 8 }} />
        </TabPane>

        <TabPane tab='Đơn đăng ký' key='registrations'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setRegEditing(null);
              setRegModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Thêm đơn
          </Button>

          {selectedRegistrations.length > 0 ? (
            <Space style={{ marginBottom: 12 }}>
              <Button type='primary' onClick={() => bulkUpdateRegistrationStatus(selectedRegistrations, 'Approved')}>
                Duyệt {selectedRegistrations.length} đơn đã chọn
              </Button>
              <Button danger onClick={() => setBulkRejectModalVisible(true)}>
                Từ chối {selectedRegistrations.length} đơn đã chọn
              </Button>
            </Space>
          ) : null}

          <Table
            rowKey='id'
            dataSource={registrations}
            columns={registrationColumns}
            rowSelection={{
              selectedRowKeys: selectedRegistrations,
              onChange: (keys) => setSelectedRegistrations(keys as string[]),
            }}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab='Thành viên CLB' key='members'>
          <Space style={{ marginBottom: 12 }}>
            <Button
              type='primary'
              disabled={!selectedMembers.length}
              onClick={() => setTransferModalVisible(true)}
            >
              Chuyển CLB ({selectedMembers.length})
            </Button>
            <Button onClick={() => exportMembersAsXlsx(undefined)}>Xuất XLSX</Button>
          </Space>

          <Table
            rowKey='id'
            dataSource={members}
            columns={memberColumns}
            rowSelection={{
              selectedRowKeys: selectedMembers,
              onChange: (keys) => setSelectedMembers(keys as string[]),
            }}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab='Báo cáo' key='report'>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic title='Số CLB' value={stats.totalClubs} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đơn Pending' value={stats.totalPending} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đơn Approved' value={stats.totalApproved} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đơn Rejected' value={stats.totalRejected} />
              </Card>
            </Col>
          </Row>

          <Card title='Số đơn đăng ký theo CLB'>
            <ColumnChart
              xAxis={stats.registrationsByClub.map((item) => item.club.name)}
              yAxis={[
                stats.registrationsByClub.map((item) => item.pending),
                stats.registrationsByClub.map((item) => item.approved),
                stats.registrationsByClub.map((item) => item.rejected),
              ]}
              yLabel={['Pending', 'Approved', 'Rejected']}
            />
          </Card>

          <Space style={{ marginTop: 12 }}>
            <Button onClick={() => exportMembersAsXlsx()}>Xuất thành viên Approved ( tất cả )</Button>
          </Space>
        </TabPane>
      </Tabs>

      <ClubForm
        visible={clubModalVisible}
        initialValue={clubEditing ?? null}
        onCancel={() => setClubModalVisible(false)}
        onSubmit={(value) => {
          if (clubEditing) updateClub(clubEditing.id, value as Club);
          else addClub(value as Omit<Club, 'id' | 'createdAt'>);
          setClubModalVisible(false);
        }}
      />

      <RegistrationForm
        visible={regModalVisible}
        clubs={clubs}
        initialValue={regEditing ?? null}
        onCancel={() => setRegModalVisible(false)}
        onSubmit={(value) => {
          if (regEditing) {
            updateRegistration(regEditing.id, value as Partial<Registration>);
          } else {
            addRegistration(value as any);
          }
          setRegModalVisible(false);
        }}
      />

      <Modal
        title={memberListClub ? `Thành viên CLB ${memberListClub.name}` : 'Danh sách thành viên'}
        visible={memberListModalVisible}
        onCancel={() => setMemberListModalVisible(false)}
        footer={null}
      >
        <Table
          size='small'
          rowKey='id'
          dataSource={members.filter((m) => m.clubId === memberListClub?.id)}
          columns={memberColumns}
          pagination={{ pageSize: 8 }}
        />
      </Modal>

      <Modal
        title='Lịch sử thao tác đơn đăng ký'
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
      >
        <Table
          rowKey='id'
          dataSource={historyItem?.history ?? []}
          columns={[
            { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
            { title: 'Admin', dataIndex: 'admin', key: 'admin' },
            { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
            { title: 'Thời điểm', dataIndex: 'at', key: 'at', render: (v: string) => new Date(v).toLocaleString() },
          ]}
        />
      </Modal>

      <Modal
        title='Từ chối đơn đăng ký'
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => {
          if (rejectCandidate && rejectReason.trim()) {
            updateRegistrationStatus(rejectCandidate.id, 'Rejected', rejectReason);
            setRejectModalVisible(false);
            setRejectCandidate(null);
            setRejectReason('');
          }
        }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder='Chọn lý do từ chối'
          value={rejectReason || undefined}
          onChange={(value) => setRejectReason(value)}
          options={[
            { label: 'Không đạt yêu cầu', value: 'Không đạt yêu cầu' },
            { label: 'Đủ số lượng', value: 'Đủ số lượng' },
            { label: 'Khác', value: 'Khác' },
          ]}
        />
      </Modal>

      <Modal
        title='Từ chối nhiều đơn đăng ký'
        visible={bulkRejectModalVisible}
        onCancel={() => setBulkRejectModalVisible(false)}
        onOk={() => {
          if (bulkRejectReason.trim()) {
            bulkUpdateRegistrationStatus(selectedRegistrations, 'Rejected', bulkRejectReason);
            setBulkRejectModalVisible(false);
            setBulkRejectReason('');
            setSelectedRegistrations([]);
          }
        }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder='Chọn lý do từ chối'
          value={bulkRejectReason || undefined}
          onChange={(value) => setBulkRejectReason(value)}
          options={[
            { label: 'Không đạt yêu cầu', value: 'Không đạt yêu cầu' },
            { label: 'Đủ số lượng', value: 'Đủ số lượng' },
            { label: 'Khác', value: 'Khác' },
          ]}
        />
      </Modal>

      <Modal
        title='Chuyển CLB cho thành viên'
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={() => {
          if (transferTargetClub && selectedMembers.length) {
            transferMembers(selectedMembers, transferTargetClub);
            setSelectedMembers([]);
            setTransferModalVisible(false);
          }
        }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder='Chọn CLB mới'
          options={clubs.map((item) => ({ value: item.id, label: item.name }))}
          value={transferTargetClub}
          onChange={(value) => setTransferTargetClub(value)}
        />
      </Modal>
    </div>
  );
};

export default ClubManagement;
