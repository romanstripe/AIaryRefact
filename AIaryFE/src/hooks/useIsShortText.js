import { useEffect, useState } from "react";

const useIsShortText = (ref) => {
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const cs = window.getComputedStyle(el);
      const lineH = parseFloat(cs.lineHeight || "24");
      const h = el.clientHeight;
      if (!lineH || !h) return;
      const lines = Math.round(h / lineH);
      setIsShort(lines <= 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return isShort;
};

export default useIsShortText;
