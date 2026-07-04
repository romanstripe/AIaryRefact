import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useReadAllDiaries from "../../hooks/useReadAllDiaries";
import { filterAndSortDiaries } from "../../util/diaryFilter";
import DiaryCard from "../LandingPage/components/DiaryCard";
import { useAuthStore } from "../../stores/authStore";
import SearchAndSortFilter from "./components/SearchAndSortFilter";

const AllDiariesPage = () => {
  const [openedCards, setOpenedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useReadAllDiaries();

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleToggleCard = useCallback((diaryId) => {
    setOpenedCards((prev) => ({
      ...prev,
      [diaryId]: !prev[diaryId],
    }));
  }, []);

  // 검색 및 정렬된 일기 목록
  const filteredAndSortedDiaries = useMemo(() => {
    const allDiaries = data?.pages?.flatMap((page) => page.diaries || []) || [];
    return filterAndSortDiaries(allDiaries, searchQuery, sortBy);
  }, [data, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <LoadingContainer>
            <CircularProgress size={60} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: "var(--app-muted-fg)" }}
            >
              일기들을 불러오는 중...
            </Typography>
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            일기를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderContainer width="100%" elevation={2}>
        <HeaderTitle variant="h4" component="h1">
          다른 사람들의 일기
        </HeaderTitle>
        <HeaderDescription variant="h6">
          영어 일기 작성의 다양한 예시를 살펴보고 영감을 받아보세요.
        </HeaderDescription>

        {/* 검색 및 정렬 컨트롤 */}
        <Container maxWidth="lg">
          <SearchAndSortFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchResultCount={filteredAndSortedDiaries.length}
          />
        </Container>
      </HeaderContainer>
      <ContentContainer maxWidth="lg">
        {filteredAndSortedDiaries.length > 0 && (
          <Typography variant="h7" fontWeight={600} color="var(--app-chart-1)">
            총 {filteredAndSortedDiaries.length} 개의 일기가 있습니다.
          </Typography>
        )}
        {/* 일기 카드 그리드 */}
        {filteredAndSortedDiaries.length > 0 ? (
          <DiaryGrid container spacing={3}>
            {filteredAndSortedDiaries.map((diary) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={diary._id}>
                <DiaryCardWrapper>
                  <DiaryCard
                    diary={diary}
                    isLoggedIn={isLoggedIn}
                    opened={openedCards[diary._id] || false}
                    onToggle={() => handleToggleCard(diary._id)}
                  />
                </DiaryCardWrapper>
              </Grid>
            ))}
          </DiaryGrid>
        ) : searchQuery ? (
          <EmptyStateContainer>
            <Typography variant="h5" color="var(--app-muted-fg)">
              검색 결과가 없습니다
            </Typography>
            <Typography
              variant="body1"
              color="var(--app-muted-fg)"
              sx={{ mt: 1 }}
            >
              다른 검색어로 시도해보세요
            </Typography>
          </EmptyStateContainer>
        ) : (
          <EmptyStateContainer>
            <Typography variant="h5" color="var(--app-muted-fg)">
              아직 공유된 일기가 없습니다
            </Typography>
            <EmptyStateSubText variant="body1" color="var(--app-muted-fg)">
              첫 번째 일기를 작성해보세요!
            </EmptyStateSubText>
          </EmptyStateContainer>
        )}

        {/* 무한스크롤 센티넬과 로딩 인디케이터 */}
        {hasNextPage && (
          <>
            {isFetchingNextPage && (
              <LoadingMoreContainer>
                <CircularProgress size={40} />
                <LoadingText variant="body2" color="var(--app-muted-fg)">
                  더 많은 일기를 불러오는 중...
                </LoadingText>
              </LoadingMoreContainer>
            )}
            <SentinelDiv ref={loadMoreRef} />
          </>
        )}

        {/* 더 이상 로드할 일기가 없을 때 */}
        {!hasNextPage && filteredAndSortedDiaries.length > 0 && (
          <EndMessageContainer>
            <Typography variant="body2" color="var(--app-chart-1)">
              {searchQuery
                ? "검색된 모든 일기를 확인했습니다"
                : "모든 일기를 확인했습니다"}
            </Typography>
          </EndMessageContainer>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default AllDiariesPage;

const PageContainer = styled(Box)({
  minHeight: "calc(100dvh - 70px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%)",
  padding: 0,
  marginTop: 0,
});

const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: 32,
  backgroundColor: "var(--mui-palette-background-paper)",
  marginBottom: 32,
  textAlign: "center",
  border: "none",
  [theme.breakpoints.down("md")]: {
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
  },
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "var(--app-chart-1)",
  marginBottom: 32,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.8rem",
  },
}));

const HeaderDescription = styled(Typography)(({ theme }) => ({
  color: "var(--app-muted-fg)",
  fontWeight: 400,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
    marginTop: 16,
  },
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
});

const EmptyStateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "300px",
  textAlign: "center",
});

const LoadingMoreContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "32px 0",
  minHeight: "60px",
});

const EndMessageContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 0",
  textAlign: "center",
});

const DiaryCardWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  "& .card": {
    backgroundColor: "white",
    width: "100%",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      border: "2px solid var(--app-chart-1)",
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    },
    "& .card-body": {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  },
});

const ContentContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
});

const DiaryGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const EmptyStateSubText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const SentinelDiv = styled("div")({
  height: 1,
});
