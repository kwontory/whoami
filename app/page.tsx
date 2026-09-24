import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <About />
      <Timeline />
      <Contact />
    </main>
  );
}
