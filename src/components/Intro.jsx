// components/Intro.jsx
import { useCallback } from "react";
import SplitText from "@/reactbits/TextAnimations/SplitText/SplitText";
import Orb from "@/reactbits/Backgrounds/Orb/Orb";

// Start with the exact bottom color of Hero (#07080d), then brighten downwards.
// Radials are anchored LOW so the very top stays dark and matches Hero’s end.
const INTRO_BG =
  "radial-gradient(80vmin 60vmin at 50% 85%, rgba(99,102,241,0.18), transparent 65%)," +
  "radial-gradient(120vmin 70vmin at 85% 92%, rgba(59,130,246,0.10), transparent 70%)," +
  "radial-gradient(120vmin 70vmin at 15% 95%, rgba(147,51,234,0.08), transparent 70%)," +
  "linear-gradient(180deg, #07080d 0%, #090a10 55%, #0b0b12 100%)";

export default function Intro() {
  const scrollToAbout = useCallback(() => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="intro"
      className="relative w-full overflow-hidden -mt-[2px] flow-root"
      style={{
        minHeight: "100dvh",
        margin: 0,
        padding: 0,
        background: INTRO_BG,
        paddingTop: "1px" // guard against margin-collapse
      }}
    >
      {/* Orb */}
      <div
        className="absolute left-1/2 z-10"
        style={{
          top: "54%",                         // ⬅️ nudged down for true visual center
          width: "clamp(520px, 88vmin, 1200px)",
          height: "clamp(520px, 88vmin, 1200px)",
          transform: "translate(-50%, -50%)",
          position: "absolute",
        }}
      >
        <Orb
          style={{ width: "100%", height: "100%" }}
          rotateOnHover={true}
          hoverIntensity={1.84}
          forceHoverState={false}
          hue={20}
        />
      </div>

      {/* Copy */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <SplitText
            text="Hi, I'm Rameen Arsalan"
            className="font-bold text-4xl md:text-6xl text-white"
          />
          <p className="mt-6 opacity-80 text-base md:text-lg text-white">
            GIS Engineer • Maps • Data • Interactive Web
          </p>

          <span
            role="button"
            tabIndex={0}
            onClick={scrollToAbout}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && scrollToAbout()}
            className="mt-10 inline-flex items-center gap-2 cursor-pointer select-none text-white/75 hover:text-white transition-colors"
          >
            Learn more
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
              aria-hidden="true"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
