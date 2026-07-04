import React from "react";
import { styled } from "@mui/material";
import { Box, Typography, LinearProgress } from "@mui/material";

const VocabBodyProgress = ({ vocabList, setSelectedStatus }) => {
  const totalWord = vocabList.length;
  const masteredWord = vocabList.filter((v) => v.status === "mastered").length;
  const learningWord = vocabList.filter((v) => v.status === "learning").length;
  const progress = totalWord ? Math.round((masteredWord / totalWord) * 100) : 0;

  return (
    <ProgressContainer>
      {/* 상단 3개 카드 */}
      <TopCardsContainer>
        <ProgressCard
          onClick={() => setSelectedStatus("All")}
          isClickable={true}
        >
          <ProgressValue color="text.primary">{totalWord}</ProgressValue>
          <ProgressLabel>Total Words</ProgressLabel>
        </ProgressCard>

        <ProgressCard
          onClick={() => setSelectedStatus("mastered")}
          isClickable={true}
        >
          <ProgressValue color="success.main">{masteredWord}</ProgressValue>
          <ProgressLabel>Mastered</ProgressLabel>
        </ProgressCard>

        <ProgressCard
          onClick={() => setSelectedStatus("learning")}
          isClickable={true}
        >
          <ProgressValue color="error.main">{learningWord}</ProgressValue>
          <ProgressLabel>Learning</ProgressLabel>
        </ProgressCard>
      </TopCardsContainer>

      {/* 하단 진행률 카드 */}
      <ProgressCard isClickable={false} isProgress={true}>
        <ProgressLabel>Progress</ProgressLabel>
        <ProgressValue color="text.primary">{progress}%</ProgressValue>
        <ProgressGauge
          variant="determinate"
          value={progress}
          sx={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundColor: "var(--app-chart-1)",
            },
          }}
        />
      </ProgressCard>
    </ProgressContainer>
  );
};

export default VocabBodyProgress;

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
}));

const TopCardsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(2),
  width: "100%",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr 1fr",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const ProgressCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isClickable",
})(({ theme, isClickable }) => ({
  backgroundColor: "white",
  color: "var(--mui-palette-text-secondary)",
  padding: theme.spacing(3, 2),
  border: "1px solid var(--app-border)",
  borderRadius: theme.spacing(1),
  fontSize: "1rem",
  fontWeight: 500,
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: isClickable ? "pointer" : "default",
  transition: "all 0.2s ease-in-out",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "&:hover": isClickable
    ? {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        fontWeight: 600,
      }
    : {},

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 1.5),
    fontSize: "0.9rem",
  },
}));

const ProgressValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
  margin: theme.spacing(0.5),
  display: "block",
  color:
    color === "text.primary"
      ? theme.palette.text.primary
      : color === "success.main"
      ? theme.palette.success.main
      : color === "error.main"
      ? theme.palette.error.main
      : color,
  fontSize: "2.5rem",
  fontWeight: 500,
  textAlign: "center",

  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 500,
  textAlign: "center",

  [theme.breakpoints.down("md")]: {
    fontSize: "0.9rem",
  },
}));

const ProgressGauge = styled(LinearProgress)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: "100%",
  height: 8,
  borderRadius: 4,
  backgroundColor: "rgba(0, 0, 0, 0.1)",

  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    backgroundColor: "var(--app-chart-1)",
  },
}));
