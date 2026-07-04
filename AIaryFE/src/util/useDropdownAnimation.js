import { useState, useCallback } from "react";

/**
 * 드롭다운, 아코디언, 모달 등의 열기/닫기 애니메이션을 위한 커스텀 훅
 * @param {number} animationDuration - 애니메이션 지속시간 (밀리초, 기본값: 300)
 * @returns {object} - { open, isAnimating, toggle, close, setOpen, setIsAnimating }
 */
const useDropdownAnimation = (animationDuration = 300) => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * 열기/닫기 토글 함수
   * 열려있으면 닫기 애니메이션, 닫혀있으면 열기 애니메이션 실행
   */
  const toggle = useCallback(() => {
    if (open) {
      // 닫기 애니메이션
      setIsAnimating(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
      }, animationDuration);
    } else {
      // 열기 애니메이션
      setOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
    }
  }, [open, animationDuration]);

  /**
   * 강제로 닫기 함수
   * 애니메이션과 함께 닫기
   */
  const close = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, animationDuration);
  }, [animationDuration]);

  /**
   * 강제로 열기 함수
   * 애니메이션과 함께 열기
   */
  const openDropdown = useCallback(() => {
    setOpen(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  }, [animationDuration]);

  return {
    open,
    isAnimating,
    toggle,
    close,
    openDropdown,
    setOpen,
    setIsAnimating,
  };
};

export default useDropdownAnimation;
