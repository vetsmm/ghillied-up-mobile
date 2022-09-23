import {GhillieDetailDto} from "../models/ghillies/ghillie-detail.dto";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import GhillieService from "../services/ghillie.service";
import {GhillieSearchCriteria} from "../models/ghillies/ghillie-search.criteria";

export const initialState = {
  loading: false,
  ghillie: {} as GhillieDetailDto,
  ghillieList: [] as Array<GhillieDetailDto>,
  usersGhillieList: [] as Array<GhillieDetailDto>,
  totalResults: 0,
  errorMessage: "", // Errors returned from server side
};

export type GhillieState = Readonly<typeof initialState>;

export const getGhillies = createAsyncThunk(
  "ghillie/getGhillies",
  async (criteria: GhillieSearchCriteria, thunkAPI) => {
    return await GhillieService.getGhillies(criteria)
      .then(async (response) => {
        return response;
      });
  }
);

export const joinGhillie = createAsyncThunk(
  "ghillie/joinGhillie",
  async (id: string, thunkAPI) => {
    return await GhillieService.joinGhillie(id)
      .then(_ => {
        thunkAPI.dispatch(getGhillie(id));
      });
  }
);

export const leaveGhillie = createAsyncThunk(
  "ghillie/leaveGhillie",
  async (id: string, thunkAPI) => {
    return await GhillieService.leaveGhillie(id)
      .then(_ => {
        thunkAPI.dispatch(getGhillie(id));
      })
  }
);

export const getGhillie = createAsyncThunk(
  "ghillie/getGhillie",
  async (id: string, thunkAPI) => {
    return await GhillieService.getGhillie(id)
      .then(async (response) => {
        return response.data;
      });
  }
);

export const getMyGhillies = createAsyncThunk(
  "ghillie/getMyGhillies",
  async (_, thunkAPI) => {
    return await GhillieService.getMyGhillies()
      .then(async (response) => {
        return response.data;
      });
  }
);


export const GhillieSlice = createSlice({
  name: "ghillie",
  initialState: initialState as GhillieState,
  reducers: {
    resetResults: (state) => {
      state.ghillieList = [];
      state.totalResults = 0;
    },
    updateGhillie: (state, action) => {
      state.ghillie = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(getGhillies.rejected, (state, action) => {
      console.log("getGhillies rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(getGhillie.rejected, (state, action) => {
      console.log("getGhillie rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
      state.ghillie = {} as GhillieDetailDto;
    });
    builder.addCase(joinGhillie.rejected, (state, action) => {
      console.log("joinghillie rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(leaveGhillie.rejected, (state, action) => {
      console.log("leavehillied rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(getMyGhillies.rejected, (state, action) => {
      console.log("getMyGhillies rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(getGhillies.fulfilled, (state, action) => {
      state.ghillieList = action.payload.data;
      state.totalResults = action.payload.meta.count;
      state.loading = false
    });
    builder.addCase(getGhillie.fulfilled, (state, action) => {
      state.ghillie = action.payload;
      state.loading = false
    });
    builder.addCase(joinGhillie.fulfilled, (state, action) => {
      state.loading = false
    });
    builder.addCase(leaveGhillie.fulfilled, (state, action) => {
      state.loading = false
    });
    builder.addCase(getMyGhillies.fulfilled, (state, action) => {
      state.usersGhillieList = action.payload;
      state.loading = false
    });
    builder.addCase(getGhillies.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getGhillie.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(joinGhillie.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(leaveGhillie.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMyGhillies.pending, (state, action) => {
      state.loading = true;
    });
  }
});

export default GhillieSlice.reducer;

// eslint-disable-next-line no-empty-pattern
export const {
  resetResults,
  updateGhillie
} = GhillieSlice.actions;
