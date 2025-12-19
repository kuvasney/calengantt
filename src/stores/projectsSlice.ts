import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../types/project";

interface ProjectState {
  highlightedProject: Project | null;
}

const initialState: ProjectState = {
  highlightedProject: null,
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
  },
});

export const { setHighlightedProject, clearHighlightedProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
