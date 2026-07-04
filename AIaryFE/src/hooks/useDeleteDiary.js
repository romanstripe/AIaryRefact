import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiaryApi } from "../apis/diaryApi";
import { useAuthStore } from "../stores/authStore";
import useDiaryStore from "../stores/useDiaryStore";
import useSnackbarStore from "../stores/useSnackbarStore";

const useDeleteDiary = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useSnackbarStore();
  const userId = useAuthStore((s) => s.user?._id);
  const { setDiaryForDate, setDayHasEntry, setDisplayDateKey } =
    useDiaryStore.getState();

  const mutation = useMutation({
    mutationFn: ({ id }) => deleteDiaryApi(id),
    onSuccess: (_, variables) => {
      const { date, year, month } = variables;

      setDiaryForDate(date, null);
      setDayHasEntry(date, null);
      setDisplayDateKey(date);

      queryClient.invalidateQueries({
        queryKey: ["myDailyDiary", userId, date],
      });
      queryClient.invalidateQueries({
        queryKey: ["myMonthlyDiaries", userId, year, month],
      });
      queryClient.invalidateQueries({ queryKey: ["allDiaries"] });

      showSuccess("일기가 성공적으로 삭제되었습니다.", 3000, {
        vertical: "top",
        horizontal: "center",
      });
    },
    onError: (err) => {
      console.error("삭제 실패:", err);
    },
  });

  return {
    mutate: mutation.mutate, // 호출할 때 사용
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useDeleteDiary;
