import { configureStore, createSlice } from '@reduxjs/toolkit';

const myList = createSlice({
  name: 'myList',
  initialState: [],
  reducers: {
    addElement: (state, action) => {
      const isAlreadyAdded = state.findIndex(
        (elem) => elem.data.id === action.payload.data.id
      );
      if (isAlreadyAdded === -1) state.push(action.payload);
    },
    deleteElement: (state, action) => {
      state = state.filter((elem) => elem.data.id !== action.payload);
      return state;
    },
    replaceList: (state, action) => {
      const newState = action.payload;
      return newState;
    },
  },
});

export const { addElement, deleteElement, replaceList } = myList.actions;

export const store = configureStore({
  reducer: {
    myList: myList.reducer,
  },
});
