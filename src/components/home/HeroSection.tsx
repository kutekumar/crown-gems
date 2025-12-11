import { Button } from "@/components/ui/button";
import { SparkleIcon } from "@/components/icons/DiamondIcon";
import heroImage from "@/assets/hero-ring.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-champagne-light/40 rounded-full mb-6 animate-fade-up opacity-0 delay-100">
              <SparkleIcon className="w-4 h-4 text-champagne" />
              <span className="text-xs font-medium text-charcoal-soft">
                Discover Curated Gemstones
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4 animate-fade-up opacity-0 delay-200">
              Where Beauty Meets{" "}
              <span className="text-champagne">Brilliance</span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0 animate-fade-up opacity-0 delay-300">
              Connect with trusted jewelers and discover extraordinary gemstones, 
              handcrafted with passion and precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-up opacity-0 delay-400">
              <Button variant="champagne" size="lg">
                Explore Collection
              </Button>
              <Button variant="champagne-outline" size="lg">
                Meet Our Sellers
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center md:justify-start gap-6 mt-8 animate-fade-up opacity-0 delay-500">
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-champagne">500+</p>
                <p className="text-xs text-muted-foreground">Verified Sellers</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-champagne">12K+</p>
                <p className="text-xs text-muted-foreground">Unique Pieces</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-champagne">98%</p>
                <p className="text-xs text-muted-foreground">Happy Buyers</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 md:order-2 relative animate-fade-up opacity-0">
            <div className="relative aspect-square max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-champagne/20 to-rose-gold/20 rounded-full blur-3xl" />
              <img
                src={heroImage}
                alt="Elegant diamond ring on marble"
                className="relative w-full h-full object-cover rounded-3xl shadow-elevated"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-0 bg-background rounded-2xl shadow-card p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-champagne-light rounded-full flex items-center justify-center">
                    <SparkleIcon className="w-5 h-5 text-champagne" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">New Arrivals</p>
                    <p className="text-sm font-semibold">This Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
