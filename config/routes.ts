import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
	},
	{
		path: '/oan-tu-ti',
		name: 'Bai1',
		component: './OanTuTi',
		
	},
	{
		path: '/question-bank',
		name: 'Bai2',
		component: './QuestionBank',
	},
	{ name: 'Quản lý Lịch hẹn', path: '/th03', routes: [
		{
			name: 'NhanVien',
			path: 'nhan-vien',
			component: './TH03/NhanVien',
		},
		{
			name: 'DichVu',
			path: 'dich-vu',
			component: './TH03/DichVu',
		},
		{
			name: 'LichHen',
			path: 'lich-hen',
			component: './TH03/LichHen',
		},
		{
			name: 'DanhGia',
			path: 'danh-gia',
			component: './TH03/DanhGia',
		},
	]},
	






	///////////////////////////////////
	


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
