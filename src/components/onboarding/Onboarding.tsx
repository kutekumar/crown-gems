import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GemIcon, SparkleIcon, DiamondIcon } from "@/components/icons/DiamondIcon";
import { ChevronRight, Store, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: <GemIcon className="w-12 h-12 text-champagne" />,
    title: "Discover Extraordinary Gems",
    description: "Browse thousands of handcrafted jewelry pieces from verified sellers worldwide.",
  },
  {
    icon: <SparkleIcon className="w-12 h-12 text-champagne" />,
    title: "Connect Directly with Sellers",
    description: "No middlemen. Chat and negotiate directly with trusted jewelers and gem dealers.",
  },
  {
    icon: <DiamondIcon className="w-12 h-12 text-champagne" filled />,
    title: "Quality Guaranteed",
    description: "Every seller is verified. Every gemstone is authentic. Shop with confidence.",
  },
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUserType, setShowUserType] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowUserType(true);
    }
  };

  const handleSkip = () => {
    setShowUserType(true);
  };

  if (showUserType) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <div className="text-center mb-10 animate-fade-up opacity-0">
            <GemIcon className="w-12 h-12 text-champagne mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-semibold mb-2">
              Welcome to Crown Gems
            </h1>
            <p className="text-muted-foreground">
              How would you like to use the marketplace?
            </p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={onComplete}
              className="w-full p-6 bg-card border border-border rounded-2xl text-left hover:border-champagne hover:shadow-card transition-all duration-300 group animate-fade-up opacity-0 delay-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-champagne-light rounded-xl flex items-center justify-center group-hover:bg-champagne transition-colors">
                  <ShoppingBag className="w-6 h-6 text-champagne group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold mb-1 flex items-center gap-2">
                    I'm a Buyer
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-champagne transition-colors" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and discover beautiful gemstones and jewelry from trusted sellers
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={onComplete}
              className="w-full p-6 bg-card border border-border rounded-2xl text-left hover:border-champagne hover:shadow-card transition-all duration-300 group animate-fade-up opacity-0 delay-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-champagne transition-colors">
                  <Store className="w-6 h-6 text-charcoal-soft group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold mb-1 flex items-center gap-2">
                    I'm a Seller
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-champagne transition-colors" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    List your jewelry and connect with buyers from around the world
                  </p>
                </div>
              </div>
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-8 animate-fade-up opacity-0 delay-300">
            You can always change this later in settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          {/* Icon */}
          <div
            key={currentSlide}
            className="mb-8 animate-scale-in"
          >
            <div className="w-24 h-24 bg-champagne-light rounded-full mx-auto flex items-center justify-center">
              {slides[currentSlide].icon}
            </div>
          </div>

          {/* Text */}
          <div
            key={`text-${currentSlide}`}
            className="animate-fade-up"
          >
            <h2 className="font-serif text-2xl font-semibold mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 pb-8">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-champagne"
                  : "w-2 bg-secondary hover:bg-champagne-light"
              )}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant="champagne"
          size="xl"
          className="w-full max-w-sm mx-auto flex justify-center"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
