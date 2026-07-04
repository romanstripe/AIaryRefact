import React, { useMemo, useState } from "react";
import NewDiaryDialog from "./NewDiaryDialog";
import { Card, CardContent, Typography, Button, styled } from "@mui/material";
import dayjs from "dayjs";

const ACCENT = "#00BE83";

const DiaryBox = ({ displayedDateKey }) => {
  const selected = useMemo(() => dayjs(displayedDateKey), [displayedDateKey]);

  const formatDate = (dk) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(dayjs(dk).toDate());

  // 작성 가능/불가 판단(오늘~그제)
  const today = dayjs().startOf("day");
  const target = selected.startOf("day");
  const dayDiff = today.diff(target, "day"); // 0~2만 작성 가능
  const isWritableDay = dayDiff >= 0 && dayDiff <= 2;

  const [openDialog, setOpenDialog] = useState(false);

  const openAddForm = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Card
        sx={{
          width: 1,
          alignSelf: { xs: "stretch", md: "auto" },
          maxWidth: { xs: "none", md: "unset" },
          height: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          textAlign: "center",
          p: 2,
          mt: 0,
          mx: { xs: 0, md: "auto" },
          boxShadow: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "success.light",
        }}
      >
        <CardContent sx={{ overflowY: "auto", flexGrow: 1 }}>
          <DiaryDate>Diary for {formatDate(displayedDateKey)}</DiaryDate>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            No Diary for this date yet.
          </Typography>

          {isWritableDay && (
            <Button
              onClick={openAddForm}
              variant="contained"
              sx={{ mt: 2, backgroundColor: ACCENT, fontWeight: 700 }}
            >
              일기 작성하기
            </Button>
          )}
        </CardContent>
      </Card>

      <NewDiaryDialog
        mode="new"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedDate={selected}
      />
    </>
  );
};

export default React.memo(DiaryBox);

const DiaryDate = styled(Typography)(() => ({
  color: ACCENT,
  fontWeight: 700,
  fontSize: "25px",
}));
