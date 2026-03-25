import { message } from 'antd';
import * as XLSX from 'xlsx';
import { useEffect, useMemo, useState } from 'react';

export type ClubStatus = 'active' | 'inactive';

export interface Club {
  id: string;
  avatar?: string;
  name: string;
  establishedAt: string;
  description?: string;
  president: string;
  active: boolean;
  createdAt: string;
}

export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TMRegistrationHistory {
  id: string;
  status: RegistrationStatus;
  admin: string;
  reason?: string;
  at: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: RegistrationStatus;
  note?: string;
  history: TMRegistrationHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skills: string;
  clubId: string;
  joinedAt: string;
}

const STORAGE = {
  clubs: 'clb_management_clubs',
  registrations: 'clb_management_registrations',
  members: 'clb_management_members',
};

const randomId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

const load = <T,>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
};

const save = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const initialClubs: Club[] = [];
const initialRegistrations: Registration[] = [];
const initialMembers: Member[] = [];

export default () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setClubs(load(STORAGE.clubs, initialClubs));
    setRegistrations(load(STORAGE.registrations, initialRegistrations));
    setMembers(load(STORAGE.members, initialMembers));
  }, []);

  useEffect(() => {
    save(STORAGE.clubs, clubs);
  }, [clubs]);

  useEffect(() => {
    save(STORAGE.registrations, registrations);
  }, [registrations]);

  useEffect(() => {
    save(STORAGE.members, members);
  }, [members]);

  const addClub = (club: Omit<Club, 'id' | 'createdAt'>) => {
    const newClub: Club = {
      ...club,
      id: randomId(),
      createdAt: new Date().toISOString(),
    };
    setClubs((prev) => [...prev, newClub]);
    message.success('Thêm câu lạc bộ thành công');
  };

  const updateClub = (id: string, update: Partial<Club>) => {
    setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, ...update } : c)));
    message.success('Cập nhật câu lạc bộ thành công');
  };

  const deleteClub = (id: string) => {
    setClubs((prev) => prev.filter((c) => c.id !== id));
    setRegistrations((prev) => prev.filter((r) => r.clubId !== id));
    setMembers((prev) => prev.filter((m) => m.clubId !== id));
    message.success('Xóa câu lạc bộ thành công');
  };

  const addRegistration = (payload: Omit<Registration, 'id' | 'history' | 'status' | 'createdAt' | 'updatedAt' | 'note'>) => {
    const newReg: Registration = {
      id: randomId(),
      ...payload,
      status: 'Pending',
      note: '',
      history: [
        {
          id: randomId(),
          status: 'Pending',
          admin: 'Hệ thống',
          at: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRegistrations((prev) => [...prev, newReg]);
    message.success('Thêm đơn đăng ký thành công');
  };

  const updateRegistration = (id: string, payload: Partial<Registration>) => {
    setRegistrations((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item)));
    message.success('Cập nhật đơn đăng ký thành công');
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa đơn đăng ký thành công');
  };

  const addMember = (payload: Omit<Member, 'id' | 'joinedAt'>) => {
    const newMember: Member = {
      id: randomId(),
      ...payload,
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    message.success('Thêm thành viên thành công');
  };

  const updateMember = (id: string, payload: Partial<Member>) => {
    setMembers((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)));
    message.success('Cập nhật thành viên thành công');
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa thành viên thành công');
  };

  const clubById = (id: string) => clubs.find((club) => club.id === id);

  const convertRegistrationToMember = (registration: Registration) => {
    const existing = members.find((m) => m.email === registration.email && m.clubId === registration.clubId);
    if (existing) return existing;
    const m: Member = {
      id: randomId(),
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      gender: registration.gender,
      address: registration.address,
      skills: registration.skills,
      clubId: registration.clubId,
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, m]);
    return m;
  };

  const updateRegistrationStatus = (id: string, status: RegistrationStatus, actionReason?: string, admin = 'Admin') => {
    const item = registrations.find((r) => r.id === id);
    if (!item) return;
    const historyRecord: TMRegistrationHistory = {
      id: randomId(),
      status,
      admin,
      reason: status === 'Rejected' ? actionReason || 'Không rõ' : undefined,
      at: new Date().toISOString(),
    };
    const newReg: Registration = {
      ...item,
      status,
      note: status === 'Rejected' ? actionReason || '' : item.note,
      updatedAt: new Date().toISOString(),
      history: [...item.history, historyRecord],
    };
    setRegistrations((prev) => prev.map((r) => (r.id === id ? newReg : r)));
    if (status === 'Approved') {
      convertRegistrationToMember(newReg);
    }
    message.success(`Đơn đăng ký đã được ${status === 'Approved' ? 'duyệt' : 'từ chối'}`);
  };

  const bulkUpdateRegistrationStatus = (ids: string[], status: RegistrationStatus, actionReason?: string, admin = 'Admin') => {
    ids.forEach((id) => updateRegistrationStatus(id, status, actionReason, admin));
    message.success(`Cập nhật trạng thái (${status}) cho ${ids.length} đơn đăng ký`);
  };

  const transferMembers = (memberIds: string[], newClubId: string) => {
    setMembers((prev) =>
      prev.map((m) => (memberIds.includes(m.id) ? { ...m, clubId: newClubId } : m)),
    );
    message.success(`Đã chuyển ${memberIds.length} thành viên sang câu lạc bộ mới`);
  };

  const exportMembersAsXlsx = (filteredClubId?: string) => {
    const data = members
      .filter((m) => (filteredClubId ? m.clubId === filteredClubId : true))
      .map((member) => ({
        'Họ tên': member.name,
        Email: member.email,
        'SĐT': member.phone,
        'Giới tính': member.gender,
        'Địa chỉ': member.address,
        'Sở trường': member.skills,
        'Câu lạc bộ': clubById(member.clubId)?.name ?? '',
        'Ngày gia nhập': new Date(member.joinedAt).toLocaleString(),
      }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');

    const fileName = filteredClubId
      ? `members-${clubById(filteredClubId)?.name || filteredClubId}.xlsx`
      : 'members.xlsx';
    XLSX.writeFile(wb, fileName);
  };

  const totalClubs = clubs.length;
  const totalRegistrations = registrations.length;
  const totalApproved = registrations.filter((r) => r.status === 'Approved').length;
  const totalPending = registrations.filter((r) => r.status === 'Pending').length;
  const totalRejected = registrations.filter((r) => r.status === 'Rejected').length;

  const registrationsByClub = useMemo(() => {
    return clubs.map((club) => {
      const list = registrations.filter((r) => r.clubId === club.id);
      return {
        club,
        pending: list.filter((r) => r.status === 'Pending').length,
        approved: list.filter((r) => r.status === 'Approved').length,
        rejected: list.filter((r) => r.status === 'Rejected').length,
      };
    });
  }, [clubs, registrations]);

  return {
    clubs,
    registrations,
    members,
    loading,
    addClub,
    updateClub,
    deleteClub,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    updateRegistrationStatus,
    bulkUpdateRegistrationStatus,
    addMember,
    updateMember,
    deleteMember,
    transferMembers,
    exportMembersAsXlsx,
    conversion: {
      totalClubs,
      totalRegistrations,
      totalApproved,
      totalPending,
      totalRejected,
      registrationsByClub,
    },
  };
};
