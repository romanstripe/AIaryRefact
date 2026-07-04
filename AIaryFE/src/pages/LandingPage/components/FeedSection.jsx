import { Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useAuthStore } from "../../../stores/authStore";
import { useMemo, useState } from "react";
import useReadAllDiaries from "../../../hooks/useReadAllDiaries";
import DiaryCard from "./DiaryCard";

dayjs.locale("ko");

export default function FeedSection() {
  const isLoggedIn = useAuthStore((s) => s.isAuthed());
  const navigate = useNavigate();

  const [openedDiaries, setOpenedDiaries] = useState(() => new Set());
  const toggleOpen = (id) => {
    setOpenedDiaries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { data, isError } = useReadAllDiaries();
  const allDiaries = useMemo(
    () => (data ? data.pages.flatMap((p) => p.diaries ?? []) : []),
    [data]
  );
  const diaries = useMemo(() => allDiaries.slice(0, 3), [allDiaries]);

  return (
    <Box className="feed">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <p className="section-title">다른 사람들의 일기</p>
          <p className="section-sub">
            영어 일기 작성의 다양한 예시를 살펴보고 영감을 받아보세요.
          </p>
        </Box>

        {isError ? (
          <p className="section-sub">
            일기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        ) : (
          <div className="cards-container">
            {diaries.map((diary) => {
              const id = diary._id ?? diary.id;
              const opened = openedDiaries.has(id);
              return (
                <DiaryCard
                  key={id}
                  diary={diary}
                  isLoggedIn={isLoggedIn}
                  opened={opened}
                  onToggle={() => toggleOpen(id)}
                />
              );
            })}
          </div>
        )}

        <Box className="feed-cta">
          <Button
            variant="outlined"
            size="large"
            className="btn-outline"
            sx={{ fontWeight: 700 }}
            onClick={() => navigate("/all-diaries")}
          >
            일기 더보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
