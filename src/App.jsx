// App.jsx
import { useState } from "react";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import SplashCursor from "@/reactbits/Animations/SplashCursor/SplashCursor";

export default function App() {
  const [ready, setReady] = useState(false);

  if (!ready) return <Loader onDone={() => setReady(true)} />;

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* 1) HERO (scroll-scrubbed globe; auto-scrolls to #intro on finish) */}
      <Hero />

      {/* 2) INTRO */}
      <section id="intro">
        <Intro />
      </section>

      {/* 3) ABOUT ME */}
      <section id="about">
        <About />
      </section>

      {/* 4) PROJECTS */}
      <section id="projects">
        <Projects />
      </section>

      {/* 5) CONTACT */}
      <section id="contact">
        <Contact />
      </section>

      <SplashCursor />
    </div>
  );
}
