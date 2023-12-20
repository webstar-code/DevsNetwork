import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../interfaces";
import { authApi } from "../api/auth";
import { RESPONSE_STATUS } from "../api/response";

interface IInitialState {
  user: IUser | null;
  error: string;
  loading: boolean;
}

const initialState: IInitialState = {
  user: null,
  error: '',
  loading: false
};

export const createCustomer = createAsyncThunk(
  'user/create',
  async (newUser: IUser, { fulfillWithValue, rejectWithValue }) => {
    const res = await authApi.createUser(newUser);
    if (res.status === RESPONSE_STATUS.success) {
      return fulfillWithValue(res.data);
    } else {
      return rejectWithValue(res.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getById',
  async (id: string, { fulfillWithValue, rejectWithValue }) => {
    const res = await authApi.getUserById(id);
    if (res.status === RESPONSE_STATUS.success) {
      return fulfillWithValue(res.data);
    } else {
      return rejectWithValue(res.message);
    }
  }
);

export const logout = createAsyncThunk('partner/logout', async (_, { fulfillWithValue, rejectWithValue }) => {
  const res = await authApi.logout();
  if (res.status === RESPONSE_STATUS.success) {
    return fulfillWithValue(res.data);
  } else {
    return rejectWithValue(res.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createCustomer.rejected, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(createCustomer.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getUserById.rejected, (state) => {
      return { ...state, error: 'something went wrong' };
    });
    builder.addCase(getUserById.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getUserById.fulfilled, (state, action: any) => {
      return { ...state, customer: action.payload, loading: false };
    });

    builder.addCase(logout.rejected, (state) => {
      return { ...state, error: 'something went wrong' };
    });
    builder.addCase(logout.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(logout.fulfilled, (state) => {
      return { ...state, customer: null, loading: false };
    });
  }
})

export default userSlice.reducer;