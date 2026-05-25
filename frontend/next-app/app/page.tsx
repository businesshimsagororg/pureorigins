import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section">
        <Hero />
      </section>
      {/* Additional sections can be added here */}
    </main>
  );
}
