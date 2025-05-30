import { Profile, Project, Prompt } from '@/type';
import {create} from 'zustand';

type GlobalState = {
  user: Profile | null;
  projects: Project[] | null;
  projectLogo: string | null;
  prompt: Prompt | null;
  result: Project | null;
  setUser: (user: Profile | null) => void;
  setProjects: (projects: Project[]) => void;
  setProjectLogo: (logo: string) => void;
  setPrompt: (prompt: Prompt) => void;
  setResult: (result: Project) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  projects: null,
  projectLogo: null,
  prompt: null,
  result: null,
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  setProjectLogo: (logo) => set({ projectLogo: logo }),
  setPrompt: (prompt) => set({ prompt }),
  setResult: (result) => set({ result }),
}));
