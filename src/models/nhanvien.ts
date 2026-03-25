export interface NhanVien {
    id: number;
    name: string;
    maxCustomerPerDay: number;
    workTime: string;
  }
  
  interface StateType {
    list: NhanVien[];
  }
  
  interface ActionType {
    type: string;
    payload: any;
  }
  
  const NhanVienModel = {
    namespace: "nhanvien",
  
    state: {
      list: [
        {
          id: 1,
          name: "Nguyễn Văn A",
          maxCustomerPerDay: 10,
          workTime: "9:00 - 17:00",
        },
      ],
    } as StateType,
  
    reducers: {
      add(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: [...state.list, payload],
        };
      },
  
      update(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.map((nv) =>
            nv.id === payload.id ? payload : nv
          ),
        };
      },
  
      delete(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.filter((nv) => nv.id !== payload),
        };
      },
    },
  };
  
  export default NhanVienModel;