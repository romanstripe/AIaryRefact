import React, { useEffect } from "react";
import dayjs from "dayjs";
import {
  Container,
  Box,
  Card,
  CardContent,
  styled,
  Typography,
} from "@mui/material";

import Calendar from "./components/Calendar";
import DiaryBox from "./components/DiaryBox";
import ResultsBox from "./components/ResultsBox";
import AiOverlay from "./components/AiOverlay";
import useDiaryStore from "../../stores/useDiaryStore";
import useReadDailyDiary from "../../hooks/useReadDailyDiary";
import { useAuthStore } from "../../stores/authStore";

import "./DailyPage.style.css";

const LAST_DATE_KEY = "lastDate";
const RELOAD_FLAG = "aboutToReload";

export default function DailyPage() {
  const {
    selectedDate,
    diariesByDate,
    displayDateKey,
    setSelectedDate,
    setDisplayDateKey,
  } = useDiaryStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(RELOAD_FLAG, "1");
      // 현재 표시 중인 날짜를 항상 저장 (리로드 복원용)
      const current = useDiaryStore.getState().displayDateKey;
      if (current) sessionStorage.setItem(LAST_DATE_KEY, current);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // --- 첫 렌더 전용 초기 키 계산 ---
  const firstRef = React.useRef(true);
  const last = sessionStorage.getItem(LAST_DATE_KEY);
  const isReload = sessionStorage.getItem(RELOAD_FLAG) === "1";
  const initKey = isReload && last ? last : dayjs().format("YYYY-MM-DD");

  // 첫 렌더에서는 initKey로 쿼리, 이후엔 store의 selectedDate로
  const selectedKeyForQuery = firstRef.current
    ? initKey
    : selectedDate.format("YYYY-MM-DD");

  useReadDailyDiary({ date: selectedKeyForQuery });

  // 첫 렌더 직후 store 동기화(오늘 또는 lastDate) + 리로드 플래그 제거
  React.useEffect(() => {
    if (!firstRef.current) return;
    firstRef.current = false;
    setSelectedDate(dayjs(initKey));
    setDisplayDateKey(initKey);
    // 한번 읽었으면 플래그 제거 (다음 내비게이션에는 오늘 기준)
    sessionStorage.removeItem(RELOAD_FLAG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 표시 키가 바뀔 때마다 lastDate도 항상 갱신(클릭/응답 모두 커버)
  React.useEffect(() => {
    if (displayDateKey) {
      sessionStorage.setItem(LAST_DATE_KEY, displayDateKey);
    }
  }, [displayDateKey]);

  // 화면에 표시할 키: displayDateKey 우선
  const effectiveKey = displayDateKey ?? selectedDate.format("YYYY-MM-DD");
  const diary = diariesByDate[effectiveKey] || null;
  const hasDiary = !!diary;
  const hasAi = !!(diary && diary.comment);

  // 캘린더 카드 크기 계산(기존 로직 유지)
  const calBasisMd = !hasDiary ? "44%" : hasAi ? "27%" : "34%";
  const calMaxMd = !hasDiary ? 680 : hasAi ? 360 : 520;
  const calMinHeight = !hasDiary ? 560 : hasAi ? 360 : 430;

  //사용자 이름 인식 일기
  const { user } = useAuthStore(); // 유저 정보
  const username = user?.name || "사용자";

  return (
    <DailyPageContainer>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        <HeaderText>{username} 님의 일기</HeaderText>
        <AiOverlay />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 2 },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: { xs: "flex-start", md: "center" },
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              flexBasis: { md: calBasisMd },
              maxWidth: { md: calMaxMd },
              width: "100%",
              transition: "all .25s ease",
              overflow: "visible",
              mx: { md: 0 },
              alignSelf: "flex-start",
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                width: "100%",
                minHeight: { xs: 400, md: calMinHeight },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  overflow: "visible",
                }}
              >
                <Calendar compact={hasAi} showLegend />
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "visible",
              width: { xs: 1, md: "100%" },
              maxWidth: "none",
              alignSelf: "flex-start",
            }}
          >
            <Box
              sx={{
                position: "relative",
                minHeight: 560,
              }}
            >
              <Box
                sx={{
                  display: hasDiary ? "block" : "none",
                  position: "relative",
                }}
              >
                <ResultsBox diary={diary} displayedDateKey={effectiveKey} />
              </Box>

              <Box
                sx={{
                  display: hasDiary ? "none" : "block",
                  position: "relative",
                }}
              >
                <DiaryBox displayedDateKey={effectiveKey} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </DailyPageContainer>
  );
}

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: "var(--mui-palette-primary-main)",
}));

const DailyPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 350px)",
  height: "100%",
  padding: "0 6rem",
  backgroundColor: "var(--mui-palette-background-paper)",
  overflowY: "hidden",

  [theme.breakpoints.down("md")]: {
    padding: "0 1rem",
    maxHeight: "none",
    height: "auto",
    overflowY: "auto",
    alignItems: "flex-start",
  },
}));
