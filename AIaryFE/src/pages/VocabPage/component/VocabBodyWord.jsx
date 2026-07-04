import React from "react";
import { styled } from "@mui/material";
import { Box, Typography, Button, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const VocabBodyWord = ({ vocab, onToggleStatus, onDelete, isPlaceholder }) => {
  if (isPlaceholder) {
    return (
      <WordCard>
        <MessageBox>{vocab.message}</MessageBox>
      </WordCard>
    );
  }

  return (
    <WordCard>
      {/* 단어 정보 */}
      <WordInfo>
        <WordHeader>
          <WordTitle>{vocab.word}</WordTitle>
          <StatusChip
            status={vocab.status.toUpperCase()}
            label={vocab.status.toUpperCase()}
          />
          <WordDate>
            <CalendarMonthIcon sx={{ fontSize: 20 }} />
            {new Date(vocab.createdAt).toLocaleDateString()}
          </WordDate>
        </WordHeader>

        <WordDefinition>
          <DefinitionLabel>Definition:</DefinitionLabel>
          <DefinitionText>{vocab.meaning}</DefinitionText>
        </WordDefinition>

        <WordExample>
          <ExampleLabel>Example:</ExampleLabel>
          <ExampleText>{vocab.example}</ExampleText>
        </WordExample>
      </WordInfo>

      {/* 버튼 정보 */}
      <WordActions>
        <ToggleButton
          onClick={() => onToggleStatus(vocab._id)}
          status={vocab.status}
        >
          {vocab.status === "mastered" ? "Set Learning" : "Set Mastered"}
        </ToggleButton>
        <DeleteButton onClick={() => onDelete(vocab._id)}>Delete</DeleteButton>
      </WordActions>
    </WordCard>
  );
};

export default VocabBodyWord;

// Styled Components
const MessageBox = styled(Box)(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontWeight: 500,
  p: 3,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  fontWeight: 600,
  padding: theme.spacing(1, 0),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const WordCard = styled(Box)(({ theme }) => ({
  background: "white",
  border: "1px solid var(--app-border)",
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4, 3),
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.1),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const WordInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: "250px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const WordHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  marginBottom: theme.spacing(1),
}));

const WordTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.2rem",
  color: "var(--mui-palette-text-primary)",
  marginRight: theme.spacing(1),
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ status }) => ({
  backgroundColor:
    status === "MASTERED" ? "rgb(92, 220, 77)" : "rgb(255, 228, 211)",
  color: status === "MASTERED" ? "rgb(255, 255, 255)" : "rgb(222, 85, 70)",

  fontWeight: 800,
  fontSize: "0.8rem",
  height: "24px",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const WordDate = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: "var(--mui-palette-text-secondary)",
  fontSize: "0.9rem",
  marginLeft: "auto",
}));

const WordDefinition = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },
}));

const DefinitionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "var(--mui-palette-text-primary)",
  minWidth: "80px",
  fontSize: "0.9rem",

  [theme.breakpoints.down("md")]: {
    minWidth: "auto",
  },
}));

const DefinitionText = styled(Typography)(({ theme }) => ({
  color: "var(--mui-palette-text-secondary)",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  flex: 1,

  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(1),
  },
}));

const WordExample = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  fontStyle: "italic",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },
}));

const ExampleLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "var(--mui-palette-text-primary)",
  minWidth: "80px",
  fontSize: "0.9rem",

  [theme.breakpoints.down("md")]: {
    minWidth: "auto",
  },
}));

const ExampleText = styled(Typography)(({ theme }) => ({
  color: "var(--mui-palette-text-secondary)",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  flex: 1,
  fontStyle: "italic",

  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(1),
  },
}));

const WordActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),

  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    marginTop: theme.spacing(1),
    width: "100%",
    justifyContent: "flex-end",
    gap: theme.spacing(0.6),
  },
}));

const ToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ theme }) => ({
  backgroundColor: "var(--mui-palette-background-paper)",
  border: "1px solid var(--app-chart-2)",
  color: "var(--app-chart-2)",
  fontSize: "0.8rem",
  fontWeight: 500,
  width: "100%",
  padding: "4px 8px",
  borderRadius: theme.spacing(0.5),
  textTransform: "none",
  "&:hover": {
    fontWeight: 700,
    backgroundColor: "rgba(96, 175, 160, 0.05)",
  },

  [theme.breakpoints.down("md")]: {
    flex: 1,
    fontSize: "0.8rem",
    padding: "3px 6px",
  },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgba(220, 53, 69, 0.05)",
  border: "1px solid #dc3545",
  color: "#dc3545",
  fontSize: "0.8rem",
  width: "100%",
  fontWeight: 500,
  padding: "4px 8px",
  borderRadius: theme.spacing(0.5),
  textTransform: "none",
  "&:hover": {
    fontWeight: 700,
    backgroundColor: "rgba(220, 53, 69, 0.15)",
    borderColor: "#c82333",
    color: "#c82333",
  },

  [theme.breakpoints.down("md")]: {
    flex: 1,
    fontSize: "0.8rem",
    padding: "3px 6px",
  },
}));
