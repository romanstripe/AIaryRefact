import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDiaryApi } from "../apis/diaryApi";
import useDiaryStore from "../stores/useDiaryStore";
import useSnackbarStore from "../stores/useSnackbarStore";
import dayjs from "dayjs";

export const useUpdateDiary = () => {
  const {
    upsertDiary,
    setAiPending,
    setDiaryForDate,
    setDayHasEntry,
    setDisplayDateKey,
  } = useDiaryStore();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbarStore();

  const mutation = useMutation({
    mutationFn: ({ id, diary }) => updateDiaryApi(id, diary),
    onMutate: () => setAiPending(true),
    onSuccess: (response) => {
      const updated = response.data;
      if (!updated?._id) {
        showError("일기 수정 응답에 문제가 있습니다.");
        return;
      }

      // 서버가 계산한 확정 키 사용 (경계/타임존 이슈 방지)
      const serverKey =
        updated?.dateKey || dayjs(updated?.date).format("YYYY-MM-DD");

      // 리스트/맵/달력 즉시 반영 (새로고침 없이 화면 반영되도록)
      upsertDiary(updated);
      setDiaryForDate(serverKey, updated);
      setDayHasEntry(serverKey, updated._id);
      setDisplayDateKey(serverKey);

      // 상세 캐시 갱신
      queryClient.setQueryData(["myDailyDiary", serverKey], {
        status: "success",
        data: updated,
      });

      // 월별/공개 피드 무효화
      const [year, month] = (serverKey || "").split("-").map(Number);
      if (Number.isInteger(year) && Number.isInteger(month)) {
        queryClient.invalidateQueries({
          queryKey: ["myMonthlyDiaries", year, month],
          exact: true,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["allDiaries"] });

      showSuccess("일기가 성공적으로 수정되었습니다.", 3000, {
        vertical: "top",
        horizontal: "center",
      });
    },
    onError: (error) => {
      showError(
        error?.message || "일기 수정 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    },
    onSettled: () => setAiPending(false),
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
