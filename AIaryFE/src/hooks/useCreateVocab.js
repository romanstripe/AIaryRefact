import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { createVocab } from "../apis/vocabApi";
import useSnackbarStore from "../stores/useSnackbarStore";

const LONG_PRESS_MS = 2000;
const MOVE_TOLERANCE_PX = 12;

const getSelectedText = () => window.getSelection()?.toString().trim() || "";

const isWordChar = (char) =>
  Boolean(char) && !/[\s.,!?;:()[\]{}"'“”‘’`~<>/\\|@#$%^&*_+=]/.test(char);

const getWordAtOffset = (text, offset) => {
  if (!text) return "";

  let index = Math.min(Math.max(offset, 0), text.length - 1);
  if (!isWordChar(text[index]) && isWordChar(text[index - 1])) {
    index -= 1;
  }
  if (!isWordChar(text[index])) return "";

  let start = index;
  let end = index + 1;

  while (start > 0 && isWordChar(text[start - 1])) start -= 1;
  while (end < text.length && isWordChar(text[end])) end += 1;

  return text.slice(start, end).trim();
};

const getCaretFromPoint = (x, y) => {
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    if (!position) return null;
    return {
      node: position.offsetNode,
      offset: position.offset,
    };
  }

  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    if (!range) return null;
    return {
      node: range.startContainer,
      offset: range.startOffset,
    };
  }

  return null;
};

const getWordFromPoint = ({ x, y, target }) => {
  const caret = getCaretFromPoint(x, y);
  if (caret?.node?.nodeType === Node.TEXT_NODE) {
    return getWordAtOffset(caret.node.textContent, caret.offset);
  }

  const text = target?.textContent || "";
  return text.trim().split(/\s+/)[0] || "";
};

const getPressPoint = (event) => {
  const touch = event.touches?.[0] || event.changedTouches?.[0];
  return {
    x: touch?.clientX ?? event.clientX,
    y: touch?.clientY ?? event.clientY,
    target: event.currentTarget,
  };
};

const useCreateVocab = (existingVocab = []) => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useSnackbarStore();
  const pressTimerRef = useRef(null);
  const startPointRef = useRef(null);

  const existingWords = useMemo(
    () =>
      existingVocab
        .map((item) => (typeof item === "string" ? item : item?.word))
        .filter(Boolean)
        .map((word) => word.toLowerCase()),
    [existingVocab]
  );

  const clearTimers = () => {
    clearTimeout(pressTimerRef.current);
    pressTimerRef.current = null;
  };

  useEffect(() => clearTimers, []);

  const mutation = useMutation({
    mutationFn: (word) => createVocab(word),
    onSuccess: (data) => {
      showSuccess(`Saved word: ${data.word}`, 3000, {
        vertical: "top",
        horizontal: "center",
      });
      queryClient.invalidateQueries({ queryKey: ["myVocab"] });
    },
    onError: (err) =>
      showError(`Failed to save word: ${err.message}`, 3000, {
        vertical: "top",
        horizontal: "center",
      }),
  });

  const saveWord = (word) => {
    if (!word) return;

    const lowerWord = word.toLowerCase();
    if (existingWords.includes(lowerWord)) {
      showError(`Already saved: ${lowerWord}`, 3000, {
        vertical: "top",
        horizontal: "center",
      });
      return;
    }

    mutation.mutate(lowerWord);
  };

  const handlePressStart = (event) => {
    clearTimers();
    startPointRef.current = getPressPoint(event);

    pressTimerRef.current = setTimeout(() => {
      const selectedWord =
        getSelectedText() || getWordFromPoint(startPointRef.current);

      if (selectedWord) {
        saveWord(selectedWord);
        clearTimers();
        window.getSelection()?.removeAllRanges();
      } else {
        showError("Press directly on a word.", 3000, {
          vertical: "top",
          horizontal: "center",
        });
      }
    }, LONG_PRESS_MS);
  };

  const handlePressMove = (event) => {
    if (!startPointRef.current) return;

    const point = getPressPoint(event);
    const moved =
      Math.abs(point.x - startPointRef.current.x) > MOVE_TOLERANCE_PX ||
      Math.abs(point.y - startPointRef.current.y) > MOVE_TOLERANCE_PX;

    if (moved) clearTimers();
  };

  const handlePressEnd = () => {
    clearTimers();
  };

  return {
    handleMouseDown: handlePressStart,
    handleMouseMove: handlePressMove,
    handleMouseUp: handlePressEnd,
    handleTouchStart: handlePressStart,
    handleTouchMove: handlePressMove,
    handleTouchEnd: handlePressEnd,
    isLoading: mutation.isPending,
  };
};

export default useCreateVocab;
