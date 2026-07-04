import { create } from "zustand";

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION = { vertical: "top", horizontal: "right" };

const useSnackbarStore = create((set) => ({
  open: false,
  message: "",
  severity: "info", // 'success', 'error', 'warning', 'info'
  autoHideDuration: DEFAULT_DURATION,
  commonPosition: DEFAULT_POSITION,

  showSnackbar: (
    message,
    severity = "info",
    duration = DEFAULT_DURATION,
    commonPosition = DEFAULT_POSITION
  ) => {
    set({
      open: true,
      message,
      severity,
      autoHideDuration: duration,
      commonPosition,
    });
  },

  hideSnackbar: () => {
    set({ open: false });
  },

  // 편의 함수들
  showSuccess: (
    message,
    duration = DEFAULT_DURATION,
    commonPosition = DEFAULT_POSITION
  ) =>
    set({
      open: true,
      message,
      severity: "success",
      autoHideDuration: duration,
      commonPosition,
    }),

  showError: (
    message,
    duration = DEFAULT_DURATION,
    commonPosition = DEFAULT_POSITION
  ) =>
    set({
      open: true,
      message,
      severity: "error",
      autoHideDuration: duration,
      commonPosition,
    }),

  showWarning: (
    message,
    duration = DEFAULT_DURATION,
    commonPosition = DEFAULT_POSITION
  ) =>
    set({
      open: true,
      message,
      severity: "warning",
      autoHideDuration: duration,
      commonPosition,
    }),

  showInfo: (
    message,
    duration = DEFAULT_DURATION,
    commonPosition = DEFAULT_POSITION
  ) =>
    set({
      open: true,
      message,
      severity: "info",
      autoHideDuration: duration,
      commonPosition,
    }),
}));

export default useSnackbarStore;
