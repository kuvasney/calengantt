import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../types/project";

interface ProjectState {
  highlightedProject: Project | null;
  projectsList: Project[];
}

const initialState: ProjectState = {
  highlightedProject: null,
  projectsList: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setHighlightedProject: (state, action: PayloadAction<Project | null>) => {
      state.highlightedProject = action.payload;
    },
    clearHighlightedProject: (state) => {
      state.highlightedProject = null;
    },
    setProjectsList: (state, action: PayloadAction<Project[]>) => {
      state.projectsList = action.payload;
    },
  },
});

export const {
  setProjectsList,
  setHighlightedProject,
  clearHighlightedProject,
} = projectsSlice.actions;
export default projectsSlice.reducer;
