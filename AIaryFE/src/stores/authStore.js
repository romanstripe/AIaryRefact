import { create } from "zustand";
import { persist } from "zustand/middleware";
import useDiaryStore from "./useDiaryStore";
import { queryClient } from "../util/reactQuery";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: ({ token, user }) => {
        sessionStorage.setItem("token", token);
        set({ token, user });

        queryClient.clear();
        useDiaryStore.getState().reset();
      },

      logout: () => {
        sessionStorage.removeItem("token");
        set({ token: null, user: null });

        queryClient.clear();
        useDiaryStore.getState().reset();
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },

      isAuthed: () => !!get().token,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) sessionStorage.setItem("token", state.token);
      },
    }
  )
);
