export interface DichVu {
    id: number;
    name: string;
    price: number;
    duration: number;
  }
  
  interface StateType {
    list: DichVu[];
  }
  
  interface ActionType {
    type: string;
    payload: any;
  }
  
  const DichVuModel = {
    namespace: "dichvu",
  
    state: {
      list: [
        {
          id: 1,
          name: "Cắt tóc",
          price: 100000,
          duration: 30,
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
          list: state.list.map((dv) =>
            dv.id === payload.id ? payload : dv
          ),
        };
      },
  
      delete(state: StateType, { payload }: ActionType) {
        return {
          ...state,
          list: state.list.filter((dv) => dv.id !== payload),
        };
      },
    },
  };
  
  export default DichVuModel;