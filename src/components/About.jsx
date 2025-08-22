// src/components/About.jsx
import { useEffect, useRef } from "react";
import ScrollStack, { ScrollStackItem } from "@/reactbits/Components/ScrollStack/ScrollStack";
import StarBorder from "@/reactbits/Animations/StarBorder/StarBorder";

export default function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    const root = aboutRef.current;
    if (!root) return;

    // ScrollStack renders ".scroll-stack-inner" inside the scrollable element.
    const scroller = root.querySelector(".scroll-stack-inner")?.parentElement;
    if (!scroller) return;

    // allow scroll chaining just in case the component set it to 'contain'
    scroller.style.overscrollBehaviorY = "auto";

    let touchStartY = 0;

    const find = (sels) => sels.map((s) => document.querySelector(s)).find(Boolean);
    const goHero = () => {
      const el = find(["#hero", "#home"]); // adjust to your hero id
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const goProjects = () => {
      const el = find(["#projects", "#work", "#portfolio"]); // adjust to your projects id
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const atTop = () => scroller.scrollTop <= 0;
    const atBottom = () =>
      Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;

    const onWheel = (e) => {
      const d = e.deltaY;
      // top & scrolling up  OR  bottom & scrolling down
      if ((d < 0 && atTop()) || (d > 0 && atBottom())) {
        e.preventDefault(); // stop the inner scroller from trapping you
        if (d < 0) goHero();
        else goProjects();
      }
    };

    const onTouchStart = (e) => (touchStartY = e.touches[0].clientY);
    const onTouchMove = (e) => {
      const dy = touchStartY - e.touches[0].clientY; // >0 means scroll down
      if ((dy < 0 && atTop()) || (dy > 0 && atBottom())) {
        e.preventDefault();
        if (dy < 0) goHero();
        else goProjects();
      }
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <section id="about" ref={aboutRef} className="bg-[#0f172a] text-white">
      <ScrollStack className="h-screen no-scrollbar" itemDistance={80} itemScale={0.02}
                   itemStackDistance={28} baseScale={0.92} rotationAmount={0} blurAmount={0}>

        {/* ...your existing cards... */}
        <ScrollStackItem itemClassName="bg-white/10 backdrop-blur-xl rounded-[40px] shadow-xl flex items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold mb-2">About Me</h2>
          {/* content */}
        </ScrollStackItem>

        {/* last card example */}
        <ScrollStackItem itemClassName="bg-white/10 backdrop-blur-xl rounded-[40px] shadow-xl flex items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold mb-4">Resume</h2>
          <StarBorder>
            <button className="px-6 py-3 rounded-md bg-white/10 border border-white/20 hover:bg-white/15 transition">
              Download Resume
            </button>
          </StarBorder>
        </ScrollStackItem>
      </ScrollStack>
    </section>
  );
}
