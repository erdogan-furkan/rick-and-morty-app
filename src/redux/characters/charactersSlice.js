import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCharacters = createAsyncThunk(
  "characters/getCharacters",
  async (page) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/character?page=${page}`
    );
    return { data };
  }
);

export const getFilteredCharacters = createAsyncThunk(
  "characters/getFilteredCharacters",
  async ({ name, status, species, gender, reset, page }) => {
    if (!page) page = 1;

    const { data } = await axios.get(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/character?name=${name}&status=${status}&species=${species}&gender=${gender}&page=${page}`
    );

    return { data, reset };
  }
);

export const charactersSlice = createSlice({
  name: "characters",
  initialState: {
    items: [],
    status: "idle",
    error: "",
    page: 1,
    hasNextPage: true,
    filters: null,
    prevFilters: null,
    isFiltered: false,
  },
  reducers: {
    setFilters: (state, action) => {
      state.prevFilters = state.filters;
      state.filters = action.payload;
    },
    setIsFiltered: (state, action) => {
      state.isFiltered = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: {
    // getCharacters
    [getCharacters.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCharacters.fulfilled]: (state, action) => {
      state.items = [...state.items, ...action.payload.data.results];
      state.status = "succeeded";
      state.page += 1;
      state.hasNextPage = Boolean(action.payload.data.info.next);
    },
    [getCharacters.rejected]: (state, action) => {
      state.error = action.error.message;
      state.status = "failed";
    },
    // getFilteredCharacters
    [getFilteredCharacters.pending]: (state, action) => {
      state.status = "loading";
    },
    [getFilteredCharacters.fulfilled]: (state, action) => {
      if (action.payload.reset) {
        state.page = 1;
        state.items = [...action.payload.data.results];
      } else {
        state.items = [...state.items, ...action.payload.data.results];
      }
      state.status = "succeeded";
      state.page += 1;
      state.hasNextPage = Boolean(action.payload.data.info.next);
      state.isFiltered = true;
    },
    [getFilteredCharacters.rejected]: (state, action) => {
      if (action.error.message === "Request failed with status code 404") {
        state.status = "notfound";
      } else {
        state.error = action.error.message;
        state.status = "failed";
      }
    },
  },
});

export const { setFilters, setIsFiltered, setStatus } = charactersSlice.actions;

export default charactersSlice.reducer;
