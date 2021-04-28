import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export type DispatchType = ReturnType<typeof useAppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
