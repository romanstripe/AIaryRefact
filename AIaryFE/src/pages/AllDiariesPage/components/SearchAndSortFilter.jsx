import React from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

const SearchAndSortFilter = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  searchResultCount,
}) => {
  return (
    <>
      <SearchAndSortContainer>
        <SearchTextField
          variant="outlined"
          placeholder="제목, 내용, 작성자로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--app-muted-fg)" }} />
              </InputAdornment>
            ),
          }}
        />
        <StyledFormControl variant="outlined">
          <InputLabel>정렬</InputLabel>
          <StyledSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="정렬"
            startAdornment={
              <SortIcon sx={{ color: "var(--app-muted-fg)", mr: 1 }} />
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "rgba(213, 255, 214, 0.8)",
                    "&:hover": {
                      backgroundColor: "var(--mui-palette-action-hover)",
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="newest">최신순</MenuItem>
            <MenuItem value="oldest">오래된순</MenuItem>
            <MenuItem value="title">제목순</MenuItem>
            <MenuItem value="author">작성자순</MenuItem>
          </StyledSelect>
        </StyledFormControl>
      </SearchAndSortContainer>

      {/* 검색 결과 통계 */}
      {searchQuery && (
        <SearchStatsContainer>
          <SearchResultChip
            label={`"${searchQuery}" 검색 결과: ${searchResultCount}개`}
            variant="outlined"
          />
        </SearchStatsContainer>
      )}
    </>
  );
};

export default SearchAndSortFilter;

// 스타일드 컴포넌트들
const SearchAndSortContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "row",
    gap: theme.spacing(1),
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "white",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--app-chart-1)",
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--app-chart-1)",
        borderWidth: 2,
      },
    },
  },
}));

const StyledFormControl = styled(FormControl)({
  minWidth: 120,
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--app-chart-1)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--app-chart-1)",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--app-chart-1)",
  },
});

const StyledSelect = styled(Select)({});

const SearchStatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),
}));

const SearchResultChip = styled(Chip)({
  fontWeight: 600,
  fontSize: "1.1rem",
  padding: "20px",
  backgroundColor: "var(--app-chart-1)",
  color: "white",
  "&:hover": {
    backgroundColor: "var(--app-chart-1)",
  },
});
