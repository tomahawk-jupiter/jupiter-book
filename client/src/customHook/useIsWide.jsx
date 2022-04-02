import { useEffect, useState } from "react";

/*
 * This custom hook will return true if the screen is >= breakpoint
 *
 * const { isWide } = useIsWide();
 */

const useIsWide = () => {
  const breakpoint = 800;
  const [isWide, setIsWide] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleWindowResize = () => setIsWide(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { isWide };
};

export default useIsWide;
