/* 
	Installed from https://reactbits.dev/tailwind/
*/

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  // Initialize displayed number
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  // ---- NEW: complete-once guard & reset ----
  const doneOnceRef = useRef(false);
  useEffect(() => {
    doneOnceRef.current = false;
  }, [from, to, direction]);
  // -----------------------------------------

  // Start the animation after delay when in view
  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart]);

  // Update text & signal completion when target actually reached
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;

        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          latest
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }

      // Fire onEnd once the value actually reaches/exceeds the target.
      const goingUp = direction !== "down";
      const reached = goingUp
        ? Math.round(latest) >= to
        : Math.round(latest) <= to;

      if (!doneOnceRef.current && reached) {
        doneOnceRef.current = true;
        if (typeof onEnd === "function") {
          // ensure "100" paints before switching screens
          requestAnimationFrame(() => onEnd());
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, maxDecimals, direction, to, onEnd]);

  return <span className={className} ref={ref} />;
}
