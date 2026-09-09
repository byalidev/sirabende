import { Categories } from "../components/home/Categories";
import { CTASection } from "../components/home/CTASection";
import { FeaturedRequests } from "../components/home/FeaturedRequests";
import { Hero } from "../components/home/Hero";
import { HowItWorks } from "../components/home/HowItWorks";
import { TrustSection } from "../components/home/TrustSection";
import { Footer } from "../components/navigation/Footer";
import { Navbar } from "../components/navigation/Navbar";

export default function Home() {
  return (
    <div className="page-shell">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedRequests />
        <Categories />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
