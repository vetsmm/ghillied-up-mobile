import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {PostDetailDto} from "../models/posts/post-detail.dto";
import {PostListingDto} from "../models/posts/post-listing.dto";
import postService from "../services/post.service";
import {CreatePostInputDto} from "../models/posts/create-post-input.dto";
import {UpdatePostInputDto} from "../models/posts/update-post-input.dto";

export const initialState = {
  loading: false,
  post: {} as PostDetailDto,
  postList: [] as Array<PostListingDto>,
  totalResults: 0,
  errorMessage: "", // Errors returned from server side
};

export type PostState = Readonly<typeof initialState>;

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post: CreatePostInputDto, thunkAPI) => {
    return await postService.createPost(post)
      .then(async (response) => {
        return response;
      });
  }
);

export const getPost = createAsyncThunk(
  "post/getPost",
  async (id: string, thunkAPI) => {
    return await postService.getPost(id)
      .then(async (response) => {
        return response;
      });
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({id, post}: {
    id: string;
    post: UpdatePostInputDto;
  }, thunkAPI) => {
    return await postService.updatePost(id, post)
      .then(async (response) => {
        return response;
      });
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: string, thunkAPI) => {
    return await postService.deletePost(id)
      .then(async (response) => {
        return response;
      });
  }
);

export const PostSlice = createSlice({
  name: "post",
  initialState: initialState as PostState,
  reducers: {
    resetResults: (state) => {
      state.postList = [];
      state.totalResults = 0;
    }
  },
  extraReducers(builder) {
    builder.addCase(createPost.rejected, (state, action) => {
      console.log("createpost rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(getPost.rejected, (state, action) => {
      console.log("getPost rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      console.log("updatePost Rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      console.log("deletepost rejected", action)
      // @ts-ignore
      state.errorMessage = action.payload.error.message;
      state.loading = false;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      // @ts-ignore
      state.post = action.payload;
      state.loading = false
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      // @ts-ignore
      state.post = action.payload;
      state.loading = false
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      // @ts-ignore
      state.post = action.payload;
      state.loading = false
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      // @ts-ignore
      state.post = action.payload;
      state.loading = false
    });
    builder.addCase(createPost.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPost.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePost.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.loading = true;
    });
  }
});

export default PostSlice.reducer;

// eslint-disable-next-line no-empty-pattern
export const {
  resetResults,
} = PostSlice.actions;
