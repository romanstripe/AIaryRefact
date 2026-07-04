import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import useDiaryStore from "../../../stores/useDiaryStore";

const ACCENT = "#00BE83";

const AiOverlay = () => {
  const { aiPending } = useDiaryStore();
  return (
    <Backdrop
      open={aiPending}
      sx={{
        color: "#fff",
        zIndex: (t) => t.zIndex.drawer + 10,
        backdropFilter: "blur(2px)",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={56} sx={{ color: ACCENT }} />
        <Typography sx={{ mt: 2, fontWeight: 700 }}>
          AI가 일기에 대한 조언과 코멘트를 작성하는 중입니다.
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default AiOverlay;
