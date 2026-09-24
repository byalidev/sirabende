import { Categories } from "../components/home/Categories";
import { CTASection } from "../components/home/CTASection";
import { FeaturedRequests } from "../components/home/FeaturedRequests";
import { Hero } from "../components/home/Hero";
import { HomeBanner } from "../components/home/HomeBanner";
import { HowItWorks } from "../components/home/HowItWorks";
import { TrustSection } from "../components/home/TrustSection";

export default function Home() {
  return (
    <div className="page-shell">
      <main>
        <Hero />
        <HomeBanner />
        <HowItWorks />
        <FeaturedRequests />
        <Categories />
        <TrustSection />
        <CTASection />
      </main>
    </div>
  );
}
