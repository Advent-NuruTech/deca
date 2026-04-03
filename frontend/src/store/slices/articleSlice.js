import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  articles: [],
  article: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
};

// Get all articles
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/articles', { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch articles'
      );
    }
  }
);

// Get single article
export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/articles/${slug}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch article'
      );
    }
  }
);

// Get all articles (admin)
export const fetchAllArticles = createAsyncThunk(
  'articles/fetchAllArticles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/articles/admin/all');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch articles'
      );
    }
  }
);

// Create article
export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/articles', articleData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create article'
      );
    }
  }
);

// Update article
export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, articleData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/articles/${id}`, articleData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update article'
      );
    }
  }
);

// Delete article
export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/articles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete article'
      );
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticle: (state) => {
      state.article = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single article
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all articles (admin)
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
      })
      // Create article
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.unshift(action.payload);
      })
      // Update article
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
        if (state.article && state.article._id === action.payload._id) {
          state.article = action.payload;
        }
      })
      // Delete article
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export const { clearArticle, clearError } = articleSlice.actions;
export default articleSlice.reducer;
