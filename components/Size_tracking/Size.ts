import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1000) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        update();

        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [breakpoint]);

    return isMobile;
}


export function Screensize(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const update = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };
  
      update();
  
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, [breakpoint]);
  
    return isMobile;
  }