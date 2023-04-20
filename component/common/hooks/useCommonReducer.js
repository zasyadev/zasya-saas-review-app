import { useReducer } from "react";
import { reducer } from "../reducer/reducer";
import { initialState } from "../reducer/initialState";

export function useCommonReducer() {
  const [{ dataList, dataLoading, dataError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return { dataList, dataLoading, dataError, dispatch };
}
