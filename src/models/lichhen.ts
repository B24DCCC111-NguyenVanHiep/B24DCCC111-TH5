export interface LichHen {
    id: number;
    employeeId: number;
    serviceId: number;
    date: string;
    time: string;
    status: string;
  }
  
  interface StateType {
    list: LichHen[];
  }
  
  interface ActionType {
    type: string;
    payload: any;
  }
  
  const LichHenModel = {
    namespace: "lichhen",
  
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
  
      updateStatus(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.map((item) =>
            item.id === payload.id ? { ...item, status: payload.status } : item
          ),
        };
      },
  
      delete(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.filter((item) => item.id !== payload),
        };
      },
    },
  };
  
  export default LichHenModel;