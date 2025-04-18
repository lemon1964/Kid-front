import { createSlice } from "@reduxjs/toolkit";

const gameStatsSlice = createSlice({
  name: "gameStats",
  initialState: { gamesPlayed: 0 },
  reducers: {
    incrementGamesPlayed(state) {
      state.gamesPlayed += 1;
    },
  },
});

export const { incrementGamesPlayed } = gameStatsSlice.actions;
export default gameStatsSlice.reducer;
