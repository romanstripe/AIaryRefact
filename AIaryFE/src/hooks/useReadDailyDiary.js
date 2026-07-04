import { useQuery } from "@tanstack/react-query";
import { getUserDiaryByDate } from "../apis/diaryApi";
import useDiaryStore from "../stores/useDiaryStore";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useAuthStore } from "../stores/authStore";

const useReadDailyDiary = ({ date }) => {
  const dateKey =
    typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
  const userId = useAuthStore((state) => state.user?._id);
  const { setDiaryForDate, setDayHasEntry, setDisplayDateKey } =
    useDiaryStore();

  const query = useQuery({
    queryKey: ["myDailyDiary", userId, dateKey],
    queryFn: () => getUserDiaryByDate({ date: dateKey }),
    enabled: !!userId && !!dateKey,
    staleTime: 0,
    gcTime: 10 * 60_000, // 10분 (사용하지 않는 캐시를 10분 뒤에 정리)
    refetchOnWindowFocus: false,
    select: (res) => (res?.status === "success" ? res.data ?? null : null),
  });

  // 중복 반영 방지용 타임스탬프 (마지막으로 Zustand에 반영한 시각을 기록해 둠)
  const appliedAtRef = useRef(0);

  // 날짜 바뀔 때마다 "이번 날짜에 대한 적용 타임스탬프" 초기화
  useEffect(() => {
    appliedAtRef.current = 0;
  }, [userId, dateKey]);

  useEffect(() => {
    if (!query.isSuccess || query.isPlaceholderData) return;
    if (query.dataUpdatedAt <= appliedAtRef.current) return;

    const diary = query.data;
    setDiaryForDate(dateKey, diary);
    setDisplayDateKey(dateKey);
    if (diary?._id) setDayHasEntry(dateKey, diary._id, true);

    appliedAtRef.current = query.dataUpdatedAt;
  }, [
    query.isSuccess,
    query.dataUpdatedAt,
    query.data,
    query.isPlaceholderData,
    date,
    setDiaryForDate,
    setDayHasEntry,
    setDisplayDateKey,
  ]);

  return query;
};

export default useReadDailyDiary;
