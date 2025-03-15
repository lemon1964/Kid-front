import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../reducers/notificationReducer";
import gameStatsReducer from "../reducers/gameStatsReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    gameStats: gameStatsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
