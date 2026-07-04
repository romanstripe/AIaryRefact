import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import useDiaryStore from "../../../stores/useDiaryStore";
import useReadVocab from "../../../hooks/useReadVocab";
import useCreateVocab from "../../../hooks/useCreateVocab";
import { Switch, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import NewDiaryDialog from "./NewDiaryDialog";
import useDeleteDiary from "../../../hooks/useDeleteDiary";
import { useUpdatePublicDiary } from "../../../hooks/useUpdatePublicDiary";

const ACCENT = "#00BE83";

const ResultsBox = ({ diary, displayedDateKey }) => {
  const { selectedDate } = useDiaryStore();

  const commentText = diary?.comment;
  const corrections = Array.isArray(diary?.corrections)
    ? diary.corrections
    : [];

  // 단어장에서 기존 단어들 가져오기
  const { vocabList } = useReadVocab();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCreateVocab(vocabList);

  const { mutate: deleteDiaryMutate } = useDeleteDiary();

  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("edit");

  const formatDateKey = (dk) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(dayjs(dk).toDate());

  const now = dayjs();
  const target = dayjs(diary?.createdAt);
  const hoursDiff = diary ? now.diff(target, "hour") : Infinity;
  const canEdit = diary && hoursDiff <= 24;

  const [isPublic, setIsPublic] = useState(Boolean(diary?.isPublic));
  const { mutate: updatePublic } = useUpdatePublicDiary();

  useEffect(() => {
    setIsPublic(Boolean(diary?.isPublic));
  }, [diary?.isPublic]);

  const handleToggle = () => {
    if (!diary?._id) return;
    const newValue = !isPublic;

    updatePublic(
      { id: diary._id, state: { isPublic: newValue } },
      { onSuccess: () => setIsPublic(newValue) }
    );
  };

  const openEditForm = () => {
    setMode("edit");
    setOpenDialog(true);
  };

  const deleteEntry = () => {
    if (!diary?._id || !diary?.dateKey) return;
    const [year, month] = diary.dateKey.split("-").map(Number);
    deleteDiaryMutate({
      id: diary._id,
      date: diary.dateKey,
      year,
      month,
    });
  };

  const displayStr =
    typeof displayedDateKey === "function"
      ? displayedDateKey(selectedDate)
      : formatDateKey(selectedDate);

  if (!diary) return null;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
          gap: { xs: 2, md: 2 },
          alignItems: "stretch",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            border: "1px solid",
            borderColor: "success.light",
            height: "100%",
            minHeight: "430px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              maxHeight: { md: "calc(100vh - 220px)" },
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: ACCENT }}>
              Diary for {displayStr}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: 900 }}>
              {diary?.title ?? ""}
            </Typography>
            {diary?.image && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <img src={diary.image} width={160} alt="image" />
              </Box>
            )}
            <Typography
              sx={{ whiteSpace: "pre-line", fontSize: "16.5px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: "pointer" }}
            >
              {diary?.content ?? ""}
            </Typography>
            <Box
              sx={{
                mt: "auto",
                pt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {canEdit && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={openEditForm}
                    variant="outlined"
                    sx={{
                      ml: 1,
                      borderColor: ACCENT,
                      color: ACCENT,
                      fontWeight: 700,
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    onClick={deleteEntry}
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1, fontWeight: 700 }}
                  >
                    삭제
                  </Button>
                </Box>
              )}

              {diary && (
                <FormControlLabel
                  sx={{ marginLeft: "auto" }} // 중요! 오른쪽 끝으로 밀어줌
                  control={
                    <Switch
                      checked={isPublic}
                      onChange={handleToggle}
                      color="success"
                    />
                  }
                  label={isPublic ? "공개" : "비공개"}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            border: "1px solid",
            borderColor: "success.light",
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              maxHeight: { md: "calc(100vh - 220px)" },
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h6"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              sx={{
                display: "block",
                cursor: "pointer",
                color: ACCENT,
              }}
              fontWeight={700}
            >
              AI Comment
            </Typography>

            {commentText && (
              <Typography
                sx={{ mt: 1, whiteSpace: "pre-line", fontSize: "15px" }}
              >
                {commentText}
              </Typography>
            )}

            {corrections.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: ACCENT }}
                >
                  Sentence Corrections
                </Typography>
                <List dense>
                  {corrections.map((c, i) => (
                    <ListItem
                      key={i}
                      sx={{
                        px: 0,
                        py: 0.3,
                        mb: 1.25,
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemText
                        sx={{ m: 0 }}
                        primary={`• ${c.originalSentence}`}
                        secondary={
                          <Box sx={{ pl: 2 }}>
                            <Box
                              component="b"
                              onMouseDown={handleMouseDown}
                              onMouseMove={handleMouseMove}
                              onMouseUp={handleMouseUp}
                              onTouchStart={handleTouchStart}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                              sx={{
                                display: "block",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              → {c.correctedSentence}
                            </Box>

                            {c.reason && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                <Chip
                                  label="해설"
                                  size="small"
                                  sx={{
                                    bgcolor: "#cbcbcbff",
                                    color: "#ffffff",
                                    height: 22,
                                    borderRadius: "6px",
                                    fontSize: 12,
                                    lineHeight: 1,
                                    flexShrink: 0,
                                  }}
                                />
                                <Box
                                  component="span"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {c.reason}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{
                          sx: {
                            fontSize: 16.5,
                            fontWeight: 500,
                            lineHeight: 1.6,
                          },
                        }}
                        secondaryTypographyProps={{
                          component: "div",
                          sx: { fontSize: 16.5, lineHeight: 1.6 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <NewDiaryDialog
        mode={mode}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default React.memo(ResultsBox);
