import { Shield, Zap, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
      title: "Enterprise Security",
      description: "Bank-grade security features protecting your documentation"
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
      title: "Lightning Fast",
      description: "Generate comprehensive docs in seconds with AI precision"
    },
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />,
      title: "Smart Output",
      description: "Perfectly structured documentation following best practices"
    },
    {
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />,
      title: "AI Enhanced",
      description: "Powered by advanced language models for accurate results"
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-purple-50/50 to-white/0" />
      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Powerful Features for
            <br className="hidden sm:block" />
            Modern Development
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="mb-4 p-2 md:p-3 rounded-xl bg-gray-50 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;