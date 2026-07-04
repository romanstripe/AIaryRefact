import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiaryApi } from "../apis/diaryApi";
import useDiaryStore from "../stores/useDiaryStore";
import useSnackbarStore from "../stores/useSnackbarStore";
import dayjs from "dayjs";

export const useCreateDiary = () => {
  const {
    upsertDiary,
    setDiaryForDate,
    setAiPending,
    setDayHasEntry,
    setDisplayDateKey,
  } = useDiaryStore();
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useSnackbarStore();

  const mutation = useMutation({
    mutationFn: (diaryPayload) => createDiaryApi(diaryPayload),
    onMutate: () => setAiPending(true),
    onSuccess: (response) => {
      if (response?.status !== "success" || !response?.data) {
        showError("일기 생성 응답에 문제가 있습니다.");
        return;
      }
      const saved = response.data;

      // 서버가 계산한 확정 키 사용 (경계/타임존 이슈 방지)
      const serverKey =
        saved?.dateKey || dayjs(saved?.date).format("YYYY-MM-DD");

      // 리스트/맵/달력 즉시 반영 (새로고침 없이 화면 반영되도록)
      upsertDiary(saved); // 다이어리 리스트에 추가
      setDiaryForDate(serverKey, saved); // 일자별 상세 맵 업데이트
      setDayHasEntry(serverKey, saved._id); // 달력 빨간 배지 표시
      setDisplayDateKey(serverKey); // 화면이 방금 생성한 날짜를 가리키도록 고정

      // 데일리 일기 상세 캐시 고정
      queryClient.setQueryData(["myDailyDiary", serverKey], {
        status: "success",
        data: saved,
      });

      // 월별 일기, 모든(공개) 일기는 무효화해서 갱신
      const [year, month] = (serverKey || "").split("-").map(Number);
      if (Number.isInteger(year) && Number.isInteger(month)) {
        queryClient.invalidateQueries({
          queryKey: ["myMonthlyDiaries", year, month],
          exact: true,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["allDiaries"] });

      showSuccess("일기와 AI 코멘트를 불러왔습니다.", 3000, {
        vertical: "top",
        horizontal: "center",
      });
    },
    onError: (error) =>
      showError(error?.message || "일기 생성 중 오류가 발생했습니다."),
    onSettled: () => setAiPending(false),
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
