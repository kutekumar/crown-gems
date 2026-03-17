import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "@/components/icons/DiamondIcon";
import heroImage from "@/assets/hero-ring.jpg";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mobileTitleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const decorativeLineRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Track mouse for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // GSAP Animations - Refined and elegant
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Decorative line reveal
      tl.fromTo(
        decorativeLineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 1.2, ease: "expo.out" }
      );

      // Title staggered reveal (desktop)
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".title-word");
        tl.fromTo(
          words,
          { opacity: 0, y: 60, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1 },
          "-=0.6"
        );
      }

      // Mobile title overlay animation
      if (mobileTitleRef.current) {
        const mobileWords = mobileTitleRef.current.querySelectorAll(".mobile-title-word");
        tl.fromTo(
          mobileWords,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        );

        // Continuous subtle looping animation for mobile title
        gsap.to(mobileTitleRef.current, {
          backgroundPosition: "200% center",
          duration: 8,
          repeat: -1,
          ease: "none",
        });
      }

      // Subtitle fade
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );

      // Image reveal with scale
      tl.fromTo(
        imageContainerRef.current,
        { opacity: 0, scale: 0.9, rotateY: -5 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: "back.out(1.4)" },
        "-=0.8"
      );

      // Floating badges
      badgeRefs.current.forEach((badge, index) => {
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5 },
            "-=0.4"
          );
          
          // Continuous floating animation
          gsap.to(badge, {
            y: -8,
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2,
          });
        }
      });

      // Scroll indicator
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      );

      // Subtle image parallax on mouse move
      gsap.to(imageRef.current, {
        x: (mousePosition.x - 0.5) * 20,
        y: (mousePosition.y - 0.5) * 20,
        duration: 0.5,
        ease: "power2.out",
      });

      setIsLoaded(true);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update parallax on mouse move
  useEffect(() => {
    if (!isLoaded || !imageRef.current) return;
    gsap.to(imageRef.current, {
      x: (mousePosition.x - 0.5) * 15,
      y: (mousePosition.y - 0.5) * 15,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [mousePosition, isLoaded]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] md:min-h-screen flex items-center overflow-hidden"
    >
      {/* Layered Background - Elegant and sophisticated */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Gradient mesh overlay */}
      <div 
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--champagne) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(var(--rose-gold) / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 100% 80% at 50% 100%, hsl(var(--champagne-light) / 0.08) 0%, transparent 40%)
          `
        }}
      />
      
      {/* Dark mode enhanced glow */}
      <div 
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(ellipse 50% 30% at 30% 30%, hsl(var(--champagne) / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 70% 70%, hsl(var(--rose-gold) / 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative accent line */}
      <div 
        ref={decorativeLineRef}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-60 dark:opacity-80"
      />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content - Takes more space for impact */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            
            {/* Eyebrow - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <div className="w-8 h-[1px] bg-champagne/60" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-champagne dark:text-champagne-light">
                Curated Excellence
              </span>
            </div>

            {/* Main Headline - Desktop only */}
            <h1
              ref={titleRef}
              className="hidden sm:block font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-[-0.02em] mb-6"
            >
              <span className="title-word inline-block text-foreground">
                Discover
              </span>
              <br className="hidden md:block" />
              <span className="title-word inline-block text-foreground">
                Timeless
              </span>{" "}
              <span className="title-word inline-block shimmer-text-gold">
                Elegance
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed mb-6 lg:mb-10"
            >
              Connect with master jewelers and uncover extraordinary gemstones, 
              each piece a testament to artistry and enduring beauty.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 lg:mb-12">
              <Button
                variant="champagne"
                size="lg"
                onClick={() => navigate("/shop")}
                className="group relative overflow-hidden px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium tracking-wide"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Collection
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-champagne via-rose-gold to-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/sellers")}
                className="group px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium border-2 hover:border-champagne hover:text-champagne dark:hover:border-champagne-light dark:hover:text-champagne-light transition-all duration-300"
              >
                Meet Our Artisans
              </Button>
            </div>

            {/* Trust Indicators - Fixed mobile layout */}
            <div className="bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl p-4 sm:p-0 sm:bg-transparent sm:backdrop-blur-none border border-border/50 sm:border-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-0 sm:flex sm:flex-wrap sm:items-center sm:gap-8 lg:gap-10">
                {[
                  { value: "500+", label: "Verified Sellers" },
                  { value: "12K+", label: "Unique Pieces" },
                  { value: "98%", label: "Satisfaction" },
                ].map((stat, index) => (
                  <div 
                    key={stat.label} 
                    className="text-center sm:text-left group"
                  >
                    <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-gradient-gold group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Section - Asymmetric and editorial */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div ref={imageContainerRef} className="relative">
              
              {/* Image wrapper with artistic frame */}
              <div className="relative aspect-[4/5] max-w-[320px] sm:max-w-[400px] lg:max-w-none mx-auto lg:ml-auto">
                
                {/* Background glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-champagne/20 via-transparent to-rose-gold/20 rounded-[2rem] blur-2xl opacity-60 dark:opacity-80" />
                
                {/* Decorative frame */}
                <div className="absolute -inset-3 border border-champagne/20 dark:border-champagne/30 rounded-[1.75rem]" />
                
                {/* Main image */}
                <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl shadow-champagne/10 dark:shadow-champagne/20">
                  <img
                    ref={imageRef}
                    src={heroImage}
                    alt="Exquisite diamond ring showcasing timeless elegance"
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay for mobile title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/30 sm:from-background/20 sm:via-transparent sm:to-transparent" />
                  
                  {/* Mobile Title Overlay - Only visible on mobile */}
                  <div 
                    ref={mobileTitleRef}
                    className="absolute inset-x-0 bottom-0 p-6 sm:hidden"
                  >
                    <div className="text-center">
                      {/* Eyebrow for mobile */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-6 h-[1px] bg-champagne/60" />
                        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-champagne-light">
                          Curated Excellence
                        </span>
                        <div className="w-6 h-[1px] bg-champagne/60" />
                      </div>
                      
                      {/* Main title with looping animation */}
                      <h1 className="font-serif text-3xl font-medium leading-tight tracking-[-0.02em]">
                        <span className="mobile-title-word inline-block text-white drop-shadow-lg animate-title-float" style={{ animationDelay: '0s' }}>
                          Discover
                        </span>
                        <br />
                        <span className="mobile-title-word inline-block text-white drop-shadow-lg animate-title-float" style={{ animationDelay: '0.1s' }}>
                          Timeless
                        </span>{" "}
                        <span className="mobile-title-word inline-block shimmer-text-gold-loop animate-title-glow" style={{ animationDelay: '0.2s' }}>
                          Elegance
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Floating accent badge - Top - Hidden on mobile */}
                <div 
                  ref={(el) => { badgeRefs.current[0] = el; }}
                  className="hidden sm:block absolute -top-3 -right-3 lg:-right-6 bg-card/95 dark:bg-card/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-champagne/10 dark:border-champagne/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-champagne/10 dark:bg-champagne/20 flex items-center justify-center">
                      <SparkleIcon className="w-4 h-4 text-champagne" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">New</p>
                      <p className="text-sm font-medium">This Week</p>
                    </div>
                  </div>
                </div>

                {/* Floating accent badge - Bottom - Hidden on mobile */}
                <div 
                  ref={(el) => { badgeRefs.current[1] = el; }}
                  className="hidden sm:block absolute -bottom-4 -left-4 lg:-left-6 bg-card/95 dark:bg-card/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-champagne/10 dark:border-champagne/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-champagne to-rose-gold border-2 border-card"
                          style={{ zIndex: 4 - i }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-medium">2.5k+</p>
                      <p className="text-[10px] text-muted-foreground">Happy Clients</p>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 border border-champagne/20 dark:border-champagne/30 rounded-full opacity-50" />
                <div className="absolute -bottom-8 -right-8 w-28 h-28 sm:w-32 sm:h-32 border border-champagne/10 dark:border-champagne/20 rounded-full opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Refined */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-champagne/60 to-transparent animate-pulse" />
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-8 right-8 w-16 h-16 hidden lg:block">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-champagne/40 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-champagne/40 to-transparent" />
      </div>
      <div className="absolute bottom-8 left-8 w-16 h-16 hidden lg:block">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-champagne/40 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-champagne/40 to-transparent" />
      </div>
    </section>
  );
};
