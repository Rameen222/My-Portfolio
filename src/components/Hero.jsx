// components/Hero.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

export default function Hero() {
  const sectionRef     = useRef(null);
  const globeRef       = useRef(null);
  const globeLayerRef  = useRef(null);   // fixed full-screen layer
  const veilRef        = useRef(null);   // dark veil during reveal
  const introMaskRef   = useRef(null);   // gradient layer revealed via circle
  const rafRef         = useRef(0);
  const jumpedRef      = useRef(false);  // auto-scroll only once

  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  // motion dials
  const STAGE_VH    = 150;  // Keep for scroll calculation
  const VISUAL_VH   = 100;  // Actual visual height
  const FINISH      = 0.60;
  const TOTAL_TURNS = 1.0;
  const END_ALT     = 0.50;
  const FOV_DEG     = 38;

  // camera path
  const END_LAT = -20, END_LNG = -140;
  const START_LAT = 50, START_LNG = END_LNG + 360 * TOTAL_TURNS;

  // circular reveal timing
  const REVEAL_BEGIN = 0.72;

  // background gradient (match Intro)
  const INTRO_BG =
    "radial-gradient(60vmin 40vmin at 50% 20%, rgba(99,102,241,0.22), transparent 65%)," +
    "radial-gradient(120vmin 70vmin at 85% 15%, rgba(59,130,246,0.12), transparent 70%)," +
    "radial-gradient(120vmin 70vmin at 15% 25%, rgba(147,51,234,0.10), transparent 70%)," +
    "linear-gradient(180deg, #0b0b12 0%, #090a10 60%, #07080d 100%)";

  useLayoutEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // renderer + camera
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !vw || !vh) return;

    const controls = g.controls?.();
    if (controls) {
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    }

    const renderer = g.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      // Oversize render to hide edges during rotation
      renderer.setSize(Math.ceil(vw * 1.12), Math.ceil(vh * 1.12), false);
      if (renderer.setClearColor) renderer.setClearColor(0x000000, 0); // transparent clear
      renderer.domElement.style.display = "block"; // avoid baseline gap
    }

    const cam = g.camera?.();
    if (cam) { cam.fov = FOV_DEG; cam.near = 0.1; cam.updateProjectionMatrix(); }

    g.pointOfView({ lat: START_LAT, lng: START_LNG, altitude: 2.25 }, 0);
  }, [vw, vh]);

  // scroll → camera + background morph + autoscroll + fade
  useEffect(() => {
    const g   = globeRef.current;
    const sec = sectionRef.current;
    if (!g || !sec) return;

    // visible at start
    if (globeLayerRef.current) {
      globeLayerRef.current.style.opacity = "1";
      globeLayerRef.current.style.visibility = "visible";
    }

    const easeInOut = (t) => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2);

    const progress = () => {
      const top = sec.offsetTop;
      const end = top + (STAGE_VH/100)*window.innerHeight - window.innerHeight;
      const raw = (window.scrollY - top) / Math.max(end - top, 1);
      return Math.max(0, Math.min(1, raw));
    };

    const getPose = (p) => {
      const phase = Math.min(p / FINISH, 1);
      const e = easeInOut(phase);
      const lng = START_LNG + (END_LNG - START_LNG) * e;
      const lat = START_LAT + (END_LAT - START_LAT) * e;
      const altitude = Math.max(END_ALT, 2.25 - (2.25 - END_ALT) * e);
      return { lat, lng, altitude, phase };
    };

    const tick = () => {
      const p = progress();
      const { lat, lng, altitude, phase } = getPose(p);
      g.pointOfView({ lat, lng, altitude }, 0);

      // circular reveal (gradient only)
      const t = Math.max(0, Math.min((phase - REVEAL_BEGIN) / (1 - REVEAL_BEGIN), 1));
      const radius = Math.hypot(vw, vh) * (0.05 + 1.15 * t);
      if (introMaskRef.current) {
        const r = `${radius}px`;
        introMaskRef.current.style.opacity = t.toString();
        introMaskRef.current.style.clipPath = `circle(${r} at 50% 50%)`;
        introMaskRef.current.style.webkitClipPath = `circle(${r} at 50% 50%)`;
      }

      // keep gradient and avoid seams
      sec.style.background = INTRO_BG;
      sec.style.marginBottom = "0";
      sec.style.paddingBottom = "0";
      sec.style.borderBottom = "none";

      if (veilRef.current) veilRef.current.style.opacity = String(0.75 * t);

      // never below viewport height
      const currentHeight = STAGE_VH - (STAGE_VH - VISUAL_VH) * Math.min(phase, 1);
      sec.style.height = `${Math.max(currentHeight, 101)}vh`;

      // fade the globe before Intro to prevent any line
      const FADE_OUT_BEGIN = 0.94;
      const fade = Math.max(0, Math.min((phase - FADE_OUT_BEGIN) / (1 - FADE_OUT_BEGIN), 1));
      if (globeLayerRef.current) {
        globeLayerRef.current.style.opacity = String(1 - fade);
        globeLayerRef.current.style.transition = "opacity 300ms ease";
        if (fade >= 1) globeLayerRef.current.style.visibility = "hidden";
      }

      // jump to #intro once finished (once)
      if (phase >= 1 && !jumpedRef.current) {
        jumpedRef.current = true;
        const next = document.querySelector("#intro");
        if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [vw, vh]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-white"
      style={{
        height: `${STAGE_VH}vh`,
        background: INTRO_BG,
        margin: 0,
        padding: 0,
        marginBottom: 0,
        paddingBottom: 0,
        border: 0,
        outline: 0,
        overflow: "visible"
      }}
    >
      {/* Full-viewport Globe layer (FIXED, oversized & perfectly centered) */}
      <div
        ref={globeLayerRef}
        className="fixed z-0 pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          width: "112vw",
          height: "112vh",
          transform: "translate(-50%, -50%)",
          opacity: 1
        }}
      >
        <Globe
          ref={globeRef}
          animateIn={false}
          width={Math.round(vw * 1.12)}
          height={Math.round(vh * 1.12)}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>

      {/* Sticky overlay stack (content + masks) */}
      <div className="sticky top-0 w-full" style={{ minHeight: "100dvh" }}>
        <div
          ref={veilRef}
          className="absolute inset-0 z-10"
          style={{ background: "#000", opacity: 0.9, pointerEvents: "none" }}
        />
        <div
          ref={introMaskRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: 0, willChange: "clip-path, opacity" }}
        >
          <div className="absolute inset-0" aria-hidden style={{ background: INTRO_BG }} />
        </div>
      </div>
    </section>
  );
}
