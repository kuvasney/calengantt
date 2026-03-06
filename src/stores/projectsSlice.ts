import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ProjectItem } from "../types/project";
import { API_CONFIG, API_ENDPOINTS, getAuthHeaders } from "@/config/api";
import { fetchWithAuth } from "@/utils/apiInterceptor";

interface ProjectState {
  highlightedProject: ProjectItem | null;
  projectsList: ProjectItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  highlightedProject: null,
  projectsList: [],
  loading: false,
  error: null,
};

// Async thunk para buscar projetos
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        return rejectWithValue("Erro ao buscar os projetos");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erro desconhecido",
      );
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setHighlightedProject: (
      state,
      action: PayloadAction<ProjectItem | null>,
    ) => {
      state.highlightedProject = action.payload;
    },
    clearHighlightedProject: (state) => {
      state.highlightedProject = null;
    },
    setProjectsList: (state, action: PayloadAction<ProjectItem[]>) => {
      state.projectsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projectsList = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProjectsList,
  setHighlightedProject,
  clearHighlightedProject,
} = projectsSlice.actions;
export default projectsSlice.reducer;
