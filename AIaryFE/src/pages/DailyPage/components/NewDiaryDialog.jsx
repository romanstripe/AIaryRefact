import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloudinaryUploadWidget from "../../../util/CloudinaryUploadWidget";
import useDiaryStore from "../../../stores/useDiaryStore";
import { useCreateDiary } from "../../../hooks/useCreateDiary";
import useSnackbarStore from "../../../stores/useSnackbarStore";
import { useUpdateDiary } from "../../../hooks/useUpdateDiary";

const ACCENT = "#00BE83";

const NewDiaryDialog = ({ mode, open, onClose }) => {
  const { selectedDate, diariesByDate } = useDiaryStore();
  const { mutate: createDiary, isPending: isCreating } = useCreateDiary();
  const { mutate: updateDiary, isPending: isUpdating } = useUpdateDiary();
  const { showError } = useSnackbarStore();

  const dateKey = useMemo(
    () => selectedDate.format("YYYY-MM-DD"),
    [selectedDate]
  );
  const diary = diariesByDate[dateKey] || null;

  const InitialFormData = {
    title: "",
    content: "",
    image: "",
    isPublic: true,
  };

  const [formData, setFormData] = useState({ ...InitialFormData });

  // 편집 모드일 때만 기존 값 세팅 / 신규는 초기화
  useEffect(() => {
    if (mode === "edit" && diary) {
      setFormData({
        title: diary.title ?? "",
        content: diary.content ?? "",
        image: diary.image ?? "",
        isPublic: !!diary.isPublic,
      });
    }
    if (mode === "new") {
      setFormData({ ...InitialFormData });
    }
  }, [mode, diary]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "new") {
      if (!formData.title.trim())
        return showError("일기 제목을 작성해주세요.", 3000, {
          vertical: "top",
          horizontal: "center",
        });
      if (!formData.content.trim())
        return showError("일기 내용을 작성해주세요.", 3000, {
          vertical: "top",
          horizontal: "center",
        });

      onClose?.();
      createDiary(
        {
          title: formData.title,
          content: formData.content,
          image: formData.image || undefined,
          isPublic: formData.isPublic,
          date: selectedDate.toISOString(),
        },
        { onSuccess: () => setFormData(InitialFormData) }
      );
    } else {
      if (!diary?._id) {
        return showError("수정할 일기를 찾을 수 없습니다.");
      }
      const { title, content, image, isPublic } = formData;

      onClose?.();
      updateDiary(
        {
          id: diary._id,
          diary: {
            title,
            content,
            image: image || undefined,
            isPublic,
          },
        },
        { onSuccess: () => setFormData(InitialFormData) }
      );
    }
  };

  const handleClose = () => {
    if (mode === "new") setFormData(InitialFormData);
    onClose();
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const uploadImage = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      Backdrop={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.36)",
          backdropFilter: "blur(2px)",
        },
      }}
      Paper={{
        elevation: 8,
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#e8f5e9",
          color: "#2e7d32",
          fontWeight: 800,
          borderBottom: "1px solid",
          borderColor: "success.light",
        }}
      >
        {selectedDate.format("YYYY-MM-DD")} 일기{" "}
        {mode === "edit" ? "수정" : "작성"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <form id="diary-form" onSubmit={handleSubmit}>
          <TextField
            id="title"
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            input={{ maxLength: 60 }}
            InputLabelProps={{
              sx: {
                "&.Mui-focused": { color: ACCENT }, // 포커스 시 라벨만 악센트
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                // 기본은 MUI 디폴트 테두리색(회색 유지)
                "&:hover fieldset": { borderColor: ACCENT },
                "&.Mui-focused fieldset": { borderColor: ACCENT },
              },
            }}
          />
          <TextField
            id="content"
            label="Write Your Diary"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={formData.content}
            onChange={handleChange}
            InputLabelProps={{
              sx: {
                "&.Mui-focused": { color: ACCENT }, // 포커스 시 라벨만 악센트
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                // 기본은 MUI 디폴트 테두리색(회색 유지)
                "&:hover fieldset": { borderColor: ACCENT },
                "&.Mui-focused fieldset": { borderColor: ACCENT },
              },
            }}
          />
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isPublic: e.target.checked }))
                }
                sx={{
                  color: ACCENT,
                  "&.Mui-checked": { color: ACCENT },
                }}
              />
            }
            label="일기 공개"
          />
        </form>

        <CloudinaryUploadWidget uploadImage={uploadImage} />
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded"
            style={{ marginTop: 10, maxWidth: "100%", borderRadius: 8 }}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button onClick={handleClose} sx={{ color: ACCENT }}>
          취소
        </Button>
        <Button
          type="submit"
          form="diary-form"
          variant="contained"
          disabled={isCreating || isUpdating}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            bgcolor: ACCENT,
            "&:hover": { bgcolor: ACCENT },
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDiaryDialog;
