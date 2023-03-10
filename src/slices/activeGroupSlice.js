import { createSlice } from "@reduxjs/toolkit";

export const activeGroupSlice = createSlice({
  name: "activeGroupSlice",
  initialState: {
    active: 0,
  },
  reducers: {
    activeGroup: (state, action) => {
      state.active = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { activeGroup } = activeGroupSlice.actions;

export default activeGroupSlice.reducer;
