import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import { Container, Box, Button, Typography } from "@mui/material";
import VocabBodyProgress from "./component/VocabBodyProgress";
import VocabBodySearch from "./component/VocabBodySearch";
import VocabBodyWord from "./component/VocabBodyWord";
import useReadVocab from "../../hooks/useReadVocab";
import useUpdateVocab from "../../hooks/useUpdateVocab";
import useDeleteVocab from "../../hooks/useDeleteVocab";
import { useAuthStore } from "../../stores/authStore";

const VocabPage = () => {
  //단어목록, 상태변화 훅들 불러오기
  const { vocabList } = useReadVocab();
  const toggleStatusMutation = useUpdateVocab();
  const deleteMutation = useDeleteVocab();

  // 필터, 검색 상태 전용
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  // 필터링, 검색 적용
  useEffect(() => {
    let filtered = vocabList;

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (v) => v.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((v) =>
        v.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(filtered);
  }, [selectedStatus, searchQuery, vocabList]);

  const emptyMessages = {
    All: "단어를 공부하러 갑시다!",
    mastered: "아직 마스터한 단어가 없습니다!",
    learning: "학습 중인 단어가 없습니다!",
  };

  const navigate = useNavigate();

  //사용자 이름 인식 단어
  const { user } = useAuthStore(); // 유저 정보
  const username = user?.name || "사용자";

  return (
    <VocabPageContainer>
      <VocabContent maxWidth="xl">
        <HeaderText>{username} 님의 단어장</HeaderText>
        <VocabLayout>
          {/* 왼쪽 패널: 검색 + 진행률 */}
          <LeftPanel>
            <VocabBodySearch
              setSelectedStatus={setSelectedStatus}
              setSearchQuery={setSearchQuery}
            />
            <VocabBodyProgress
              vocabList={vocabList}
              setSelectedStatus={setSelectedStatus}
            />
          </LeftPanel>

          {/* 오른쪽 패널: 단어 카드들 (스크롤 가능) */}

          {filteredList.length > 0 ? (
            <RightPanel>
              <VocabWordList>
                {filteredList.map((vocab) => (
                  <VocabBodyWord
                    key={vocab._id}
                    vocab={vocab}
                    onToggleStatus={() =>
                      toggleStatusMutation.mutate(vocab._id)
                    }
                    onDelete={() => deleteMutation.mutate(vocab._id)}
                  />
                ))}
              </VocabWordList>
            </RightPanel>
          ) : (
            <PlaceholderPanel>
              <Message>
                {emptyMessages[selectedStatus] || "단어가 없습니다!"}
              </Message>
              <ButtonRow>
                <ActionButton variant="outlined" onClick={() => navigate("/")}>
                  홈으로
                </ActionButton>
                <ActionButton
                  variant="outlined"
                  onClick={() => navigate("/daily")}
                >
                  일기로
                </ActionButton>
              </ButtonRow>
            </PlaceholderPanel>
          )}
        </VocabLayout>
      </VocabContent>
    </VocabPageContainer>
  );
};

export default VocabPage;

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: "var(--mui-palette-primary-main)",
}));

// Styled Components
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontSize: "1rem",
  padding: theme.spacing(1, 3),
  backgroundColor: "white",
  color: "var(--mui-palette-text-primary)",
  borderColor: "var(--app-chart-1)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",

  "&:hover": {
    backgroundColor: "var(--app-muted-bg)",
    color: "var(--app-chart-1)",
  },
}));

const PlaceholderPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  minHeight: "500px", // LeftPanel과 맞춤
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(96, 175, 160, 0.15)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  border: "1px solid var(--app-border)",

  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    height: "auto",
    boxShadow: "0 8px 32px rgba(96, 175, 160, 0.15)",
    backgroundColor: "white",
  },
}));

const Message = styled("div")(({ theme }) => ({
  fontSize: "1.2rem",
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

const ButtonRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexDirection: "row",
}));

const VocabPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // 세로 중앙
  alignItems: "center", // 이미 좌우 중앙은 돼 있음
  minHeight: "calc(100vh - 350px)", // 헤더,푸터 높이 제외
  width: "100%",
  padding: "0 6rem",
  backgroundColor: "var(--mui-palette-background-paper)",

  [theme.breakpoints.down("md")]: {
    padding: "0 1rem",
    maxHeight: "none",
    height: "auto",
    overflowY: "auto",
    alignItems: "flex-start",
  },
}));

const VocabContent = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2, 0),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1, 0),
    maxWidth: "none",
    width: "100%",
  },
}));

const VocabLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  gap: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "auto",
    gap: theme.spacing(2),
    alignItems: "stretch",
    overflowY: "auto",
    backgroundColor: "var(--mui-palette-background-paper)",
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "500px",
  height: "100%",
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(96, 175, 160, 0.15)",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),

  [theme.breakpoints.down("md")]: {
    flex: "none",
    width: "100%",
    minHeight: "auto",
    height: "auto",
    backgroundColor: "var(--mui-palette-background-paper)",
    boxShadow: "none",
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  maxHeight: "500px",
  height: "100%",
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(96, 175, 160, 0.15)",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),

  overflow: "hidden",
  overflowY: "scroll", // 스크롤은 존재
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE 10+
  "&::-webkit-scrollbar": {
    // Chrome, Safari
    display: "none",
  },

  [theme.breakpoints.down("md")]: {
    flex: "none",
    width: "100%",
    maxHeight: "none",
    height: "auto",
    overflow: "visible",
    backgroundColor: "var(--mui-palette-background-paper)",
    boxShadow: "none",
  },
}));

const VocabWordList = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "auto",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflow: "visible",
  paddingRight: theme.spacing(1),
  padding: 0,

  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "var(--app-border)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "var(--app-chart-1)",
  },

  [theme.breakpoints.down("md")]: {
    height: "auto",
    overflowY: "visible",
    gap: theme.spacing(1.5),
    paddingRight: 0,
  },
}));
