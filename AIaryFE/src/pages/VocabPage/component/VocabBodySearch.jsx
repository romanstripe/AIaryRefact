import React, { useState } from "react";
import { styled } from "@mui/material";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const VocabBodySearch = ({ setSelectedStatus, setSearchQuery }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (status) => {
    setSelectedFilter(status);
    setSelectedStatus(status);
  };

  return (
    <SearchCard>
      <SearchCardContent>
        {/* 필터 버튼 섹션 */}
        <FilterSection>
          <FilterButtonGroup
            variant="outlined"
            aria-label="vocabulary filter buttons"
          >
            <FilterButton
              onClick={() => handleFilterChange("All")}
              isSelected={selectedFilter === "All"}
            >
              All
            </FilterButton>
            <FilterButton
              onClick={() => handleFilterChange("mastered")}
              isSelected={selectedFilter === "mastered"}
            >
              Mastered
            </FilterButton>
            <FilterButton
              onClick={() => handleFilterChange("learning")}
              isSelected={selectedFilter === "learning"}
            >
              Learning
            </FilterButton>
          </FilterButtonGroup>
        </FilterSection>

        {/* 검색창 섹션 */}
        <SearchSection>
          <SearchTextField
            fullWidth
            variant="outlined"
            placeholder="Search Vocabulary..."
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--app-muted-fg)" }} />
                </InputAdornment>
              ),
            }}
          />
        </SearchSection>
      </SearchCardContent>
    </SearchCard>
  );
};

export default VocabBodySearch;

// Styled Components
const SearchCard = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  margin: 0,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    backgroundColor: "white",
    marginBottom: theme.spacing(2),
    border: "1px solid var(--app-border)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
}));

const SearchCardContent = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  padding: 0,
}));

const SearchSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexDirection: "row",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "var(--app-input-bg)",
    borderColor: "var(--app-border)",
    "&:hover": {
      backgroundColor: "var(--app-muted-bg)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--app-chart-1)",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "var(--mui-palette-background-paper)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--app-chart-1)",
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
    fontSize: "1rem",
    color: "var(--mui-palette-text-primary)",
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  alignSelf: "center",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  justifyContent: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const FilterButtonGroup = styled(ButtonGroup)(() => ({
  "& .MuiButtonGroup-grouped": {
    borderColor: "var(--app-chart-1)",
    color: "var(--mui-palette-text-secondary)",
    fontWeight: 500,
    textTransform: "none",
    padding: "8px 16px",
    "&:hover": {
      borderColor: "var(--app-chart-1)",
      color: "var(--app-chart-1)",
    },
  },
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderRight: "1px solid",
    borderRightColor: "var(--app-border)",
  },
}));

const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ isSelected }) => ({
  backgroundColor: isSelected
    ? "var(--mui-palette-background-paper) !important"
    : "white !important",
  color: isSelected
    ? "var(--app-chart-1) !important"
    : "var(--mui-palette-text-primary) !important",
  borderColor: "var(--app-chart-1) !important",
  "&:hover": {
    backgroundColor: "var(--mui-palette-background-paper) !important",
    borderColor: "var(--app-chart-1) !important",
    color: "var(--app-chart-1) !important",
  },
}));
