import { getDefaultData } from "src/constants/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useGraph from "./useGraph";
import useJson from "./useJson";

type Sponsor = {
  handle: string;
  avatar: string;
  profile: string;
};

function getTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return new Date(tomorrow).getTime();
}

const initialStates = {
  editorLanguage: 'json',
  lightmode: false,
  hideCollapse: true,
  childrenCount: true,
  imagePreview: true,
  sponsors: {
    users: [] as Sponsor[],
    nextDate: Date.now(),
  },
};

export interface ConfigActions {
  setSponsors: (sponsors: Sponsor[]) => void;
  setLightTheme: (theme: boolean) => void;
  setEditorLanguage: (value: string) => void;
  toggleHideCollapse: (value: boolean) => void;
  toggleChildrenCount: (value: boolean) => void;
  toggleImagePreview: (value: boolean) => void;
}

const useStored = create(
  persist<typeof initialStates & ConfigActions>(
    set => ({
      ...initialStates,
      setEditorLanguage:(value: string) =>{
        set({
          editorLanguage: value,
        });
        useJson.getState().setJson(getDefaultData());
      },
      setLightTheme: (value: boolean) =>
        set({
          lightmode: value,
        }),
      setSponsors: users =>
        set({
          sponsors: {
            users,
            nextDate: getTomorrow(),
          },
        }),
      toggleHideCollapse: (value: boolean) => set({ hideCollapse: value }),
      toggleChildrenCount: (value: boolean) => set({ childrenCount: value }),
      toggleImagePreview: (value: boolean) => {
        set({ imagePreview: value });
        useGraph.getState().setGraph();
      },
    }),
    {
      name: "config",
    }
  )
);

export default useStored;
