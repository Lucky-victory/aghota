import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { localPeerSlice, remotePeersSlice } from "./slices";

const store = configureStore({
  reducer: {
    local: localPeerSlice.reducer,
    remote: remotePeersSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
