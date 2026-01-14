import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectItem } from "../types/project";

interface ProjectState {
  highlightedProject: ProjectItem | null;
  projectsList: ProjectItem[];
}

const initialState: ProjectState = {
  highlightedProject: null,
  projectsList: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setHighlightedProject: (
      state,
      action: PayloadAction<ProjectItem | null>
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
});

export const {
  setProjectsList,
  setHighlightedProject,
  clearHighlightedProject,
} = projectsSlice.actions;
export default projectsSlice.reducer;
