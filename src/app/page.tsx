import Starfield from "@/components/Starfield";
import ClickRipple from "@/components/ClickRipple";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Highlights from "@/components/sections/Highlights";
import Playground from "@/components/sections/Playground";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Starfield />
      <ClickRipple />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Highlights />
        <Playground />
        <Contact />
      </main>
    </>
  );
}
