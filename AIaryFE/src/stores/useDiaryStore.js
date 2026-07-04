import { create } from "zustand";
import dayjs from "dayjs";

const useDiaryStore = create((set) => ({
  selectedDate: dayjs(),
  displayDateKey: dayjs().format("YYYY-MM-DD"),
  diaries: [],
  daysMap: {}, // { "YYYY-MM-DD": { id, canWrite } }
  diariesByDate: {}, // { "YYYY-MM-DD": diaryDoc }
  aiPending: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setDisplayDateKey: (dateKey) => set({ displayDateKey: dateKey }),
  addDiary: (date, title, content, image, isPublic) =>
    set((state) => ({
      diaries: [...state.diaries, { date, title, content, image, isPublic }],
    })),
  setMonthDays: (days) =>
    set(() => {
      const map = {};
      for (const d of days) {
        map[d.date] = { id: d.id, canWrite: d.canWrite };
      }
      return { daysMap: map };
    }),
  setDiaryForDate: (dateKey, diary) =>
    set((state) => ({
      diariesByDate: { ...state.diariesByDate, [dateKey]: diary },
    })),
  upsertDiary: (doc) =>
    set((state) => {
      const idx = state.diaries.findIndex((d) => d._id === doc._id);
      if (idx === -1) return { diaries: [doc, ...state.diaries] };
      const next = [...state.diaries];
      next[idx] = { ...next[idx], ...doc };
      return { diaries: next };
    }),
  setDayHasEntry: (dateKey, id, canWrite) =>
    set((state) => {
      const prev = state.daysMap[dateKey] || {};
      const next = { ...prev, id };
      if (typeof canWrite === "boolean") next.canWrite = canWrite;
      return {
        daysMap: {
          ...state.daysMap,
          [dateKey]: next,
        },
      };
    }),
  setAiPending: (v) => set({ aiPending: v }),

  reset: () =>
    set({
      selectedDate: dayjs(),
      displayDateKey: dayjs().format("YYYY-MM-DD"),
      diaries: [],
      daysMap: {},
      diariesByDate: {},
      aiPending: false,
    }),
}));

export default useDiaryStore;
