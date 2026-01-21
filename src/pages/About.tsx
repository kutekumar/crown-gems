import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { GemIcon } from "@/components/icons/DiamondIcon";
import { ArrowRight, Globe, Users, Zap, Shield, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mingalarmonLogo from "@/assets/mingalarmon-logo.png";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every seller is verified and every transaction is protected",
    },
    {
      icon: Heart,
      title: "Passion for Craft",
      description: "We celebrate artisans who pour their soul into every piece",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting buyers and sellers across 50+ countries",
    },
    {
      icon: Sparkles,
      title: "Quality First",
      description: "Only authentic, high-quality pieces make it to our marketplace",
    },
  ];

  const stats = [
    { value: "10K+", label: "Unique Pieces" },
    { value: "150+", label: "Verified Sellers" },
    { value: "50+", label: "Countries" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <GemIcon className="w-12 h-12 text-champagne" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
              Building Smart,<br />
              <span className="text-champagne">Human-Friendly</span><br />
              Technology
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering local businesses to reach peak accessibility and productivity through 
              centralized marketplace platforms and innovative digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="champagne" size="lg" onClick={() => navigate("/shop")}>
                Explore Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="champagne-outline" size="lg" onClick={() => navigate("/sellers")}>
                Meet Our Sellers
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-secondary/30 py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-champagne mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="container max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-champagne text-sm font-medium tracking-wider uppercase mb-4 block">
                Who We Are
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
                Pioneering Digital Excellence
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Gemora is a technology-driven brand dedicated to promoting and empowering local businesses. 
                We build centralized marketplace applications that enable businesses to showcase their services, 
                connect with customers effortlessly, and operate with unprecedented efficiency.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our jewelry marketplace brings together verified sellers from around the world, 
                offering buyers access to unique, authentic pieces while providing artisans 
                with a premium platform to showcase their craft.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <Users className="w-6 h-6 text-champagne mb-2" />
                  <h4 className="font-medium mb-1">Customer Connectivity</h4>
                  <p className="text-xs text-muted-foreground">Bridging buyers and sellers seamlessly</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <Zap className="w-6 h-6 text-champagne mb-2" />
                  <h4 className="font-medium mb-1">Operational Efficiency</h4>
                  <p className="text-xs text-muted-foreground">Smart tech that saves time</p>
                </div>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-champagne/10 to-champagne/5 rounded-2xl border border-champagne/20">
                <h3 className="font-serif text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower local businesses using cutting-edge technology solutions that deliver 
                  low cost but high-impact results.
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-champagne/20 text-champagne text-xs rounded-full">Innovation</span>
                  <span className="px-3 py-1 bg-champagne/20 text-champagne text-xs rounded-full">Accessibility</span>
                  <span className="px-3 py-1 bg-champagne/20 text-champagne text-xs rounded-full">Empowerment</span>
                </div>
              </div>

              <div className="p-8 bg-card border border-border rounded-2xl">
                <h3 className="font-serif text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To create a connected digital ecosystem where businesses feel confident, 
                  premium, and competitive in the modern marketplace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-card rounded-2xl border border-border text-center">
                  <div className="w-12 h-12 bg-champagne/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-champagne" />
                  </div>
                  <h3 className="font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Powered By Section */}
        <section className="container max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">Powered by</p>
            <a 
              href="https://mingalarmon.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img 
                src={mingalarmonLogo} 
                alt="Mingalar Mon" 
                className="h-16 md:h-20 object-contain mx-auto"
              />
            </a>
            <p className="text-muted-foreground mt-6 max-w-lg mx-auto">
              Mingalar Mon is a technology-driven brand dedicated to promoting and empowering 
              local businesses through innovative digital solutions.
            </p>
            <a 
              href="https://mingalarmon.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-champagne font-medium mt-4 hover:gap-3 transition-all"
            >
              Visit Mingalar Mon
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-champagne/20 via-champagne/10 to-champagne/20 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
              Ready to Discover Your Perfect Piece?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Browse our curated collection of exquisite jewelry from verified sellers worldwide
            </p>
            <Button variant="champagne" size="lg" onClick={() => navigate("/shop")}>
              Start Browsing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default About;
