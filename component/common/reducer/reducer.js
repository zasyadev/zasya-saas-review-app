import { RESET, SET_ERROR, SET_LIST, SET_LOADING } from "./action";

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_LIST:
      return {
        ...state,
        dataList: action.payload,
        dataLoading: false,
      };
    case SET_ERROR:
      return {
        ...state,
        dataError: action.payload,
        dataLoading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        dataLoading: action.payload,
      };
    case RESET:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
