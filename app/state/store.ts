import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { meetingCreator } from "./slices";

const store = configureStore({
  reducer: {
    meetingCreator: meetingCreator.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
