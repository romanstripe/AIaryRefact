import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import useDiaryStore from "../../../stores/useDiaryStore";
import useReadMonthlyDiaries from "../../../hooks/useReadMonthlyDiaries";

const StyledDateCalendar = styled(DateCalendar, {
  shouldForwardProp: (prop) => prop !== "isDesktop" && prop !== "compact",
})(({ isDesktop, compact }) => {
  const DAY = isDesktop ? (compact ? 34 : 54) : 36;
  const FS = isDesktop ? (compact ? "0.85rem" : "1.06rem") : "0.9rem";
  const LABEL = isDesktop ? (compact ? "0.9rem" : "1.06rem") : "0.9rem";
  const GAP = isDesktop ? (compact ? 0.75 : 2.4) : 2; // px

  const sixWeeksMin = isDesktop ? (compact ? 300 : 420) : 300;

  return {
    width: "100%",
    margin: "4px 2px",
    paddingBottom: 0,
    overflow: "visible",
    "& *": { overflow: "visible" },
    "& .MuiDayCalendar-weekDayLabel": {
      fontSize: LABEL,
      fontWeight: 600,
      marginBottom: "6px",
    },
    "& div[role='row']": {
      justifyContent: "space-around",
      overflow: "visible",
    },
    "& .MuiDayCalendar-slideTransition": {
      minHeight: sixWeeksMin,
      overflow: "visible",
    },
    "& .MuiDayCalendar-monthContainer": { overflow: "visible" },
    "& .MuiDayCalendar-weekContainer": { overflow: "visible" },
    "& .MuiPickersDay-root": {
      height: DAY,
      width: DAY,
      fontSize: FS,
      margin: GAP,
    },
  };
});

function DayWithDot(props) {
  const { day, outsideCurrentMonth, compact } = props;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { daysMap } = useDiaryStore.getState();
  const dk = day.format("YYYY-MM-DD");
  const hasEntry = !!daysMap[dk]?.id;

  if (outsideCurrentMonth) return <PickersDay {...props} />;

  const DOT = isDesktop ? (compact ? 7 : 10) : 7;
  const TOP = isDesktop ? (compact ? 6 : 14) : 6;
  const RIGHT = isDesktop ? (compact ? 2 : 4) : 2;

  return (
    <Badge
      overlap="circular"
      variant={hasEntry ? "dot" : undefined}
      color="error"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": { zIndex: 2 },
        "& .MuiBadge-dot": {
          width: DOT,
          height: DOT,
          minWidth: DOT,
          minHeight: DOT,
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          display: "inline-block",
          boxSizing: "content-box",
        },
        "& .MuiBadge-anchorOriginTopRightCircular": { top: TOP, right: RIGHT },
      }}
    >
      <PickersDay {...props} />
    </Badge>
  );
}

export default function Calendar({ compact = false, showLegend = false }) {
  const { selectedDate, setSelectedDate } = useDiaryStore();
  const [currentView, setCurrentView] = useState("day");
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const year = selectedDate.year();
  const month = selectedDate.month() + 1;
  useReadMonthlyDiaries({ year, month });

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledDateCalendar
          isDesktop={isDesktop}
          compact={compact}
          value={selectedDate}
          view={currentView}
          onViewChange={(v) => setCurrentView(v)}
          onChange={(d) => {
            setSelectedDate(d);
            sessionStorage.setItem("lastDate", d.format("YYYY-MM-DD"));
          }}
          views={["year", "month", "day"]}
          slots={{ day: DayWithDot }}
          slotProps={{
            day: {
              compact,
              sx: {
                "&.Mui-selected": { backgroundColor: "#4caf50", color: "#fff" },
                "&.Mui-selected:hover": { backgroundColor: "#388e3c" },
                "&.Mui-selected:focus, &.Mui-selected.Mui-focusVisible": {
                  backgroundColor: "#388e3c",
                  outline: "none",
                },
                "&.MuiPickersDay-today": { border: "2px solid #4caf50" },
              },
            },
          }}
        />
      </LocalizationProvider>

      {showLegend && (
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 2.5 },
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#4caf50",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Today
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#FFCCBC",
                  border: "2px solid #4caf50",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Has Entry
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
