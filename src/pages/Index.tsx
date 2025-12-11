import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { AllProducts } from "@/components/home/AllProducts";
import { Onboarding } from "@/components/onboarding/Onboarding";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("gemora_onboarding_complete");
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("gemora_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <AllProducts />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
