export interface DanhGia {
    id: number;
    employeeId: number;
    rating: number;
    comment: string;
    reply?: string;
  }
  
  interface StateType {
    list: DanhGia[];
  }
  
  interface ActionType {
    type: string;
    payload: any;
  }
  
  const DanhGiaModel = {
    namespace: "danhgia",
  
    state: {
      list: [],
    } as StateType,
  
    reducers: {
      add(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: [...state.list, payload],
        };
      },
  
      reply(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.map((dg) =>
            dg.id === payload.id ? { ...dg, reply: payload.reply } : dg
          ),
        };
      },
  
      delete(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.filter((dg) => dg.id !== payload),
        };
      },
    },
  };
  
  export default DanhGiaModel;