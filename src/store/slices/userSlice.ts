import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid package

const getInitialUserId = () => {
  const storedId = localStorage.getItem('userId');
  if (storedId) return storedId;
  
  const newId = uuidv4();
  localStorage.setItem('userId', newId);
  return newId;
};

interface UserState {
  userId: string;
}

const initialState: UserState = {
  userId: getInitialUserId(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },
  },
});

export const { setUserId } = userSlice.actions;
export default userSlice.reducer; 