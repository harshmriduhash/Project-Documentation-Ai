import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";

const BlogSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Explore and spread<br />Our Blog
            </h2>
            <p className="text-gray-600 mb-6">
              Follow our documentation tips and blog posts for insights into better code documentation practices.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-xs"
              />
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                Subscribe
              </Button>
            </div>
          </div>
          
          <Card className="relative overflow-hidden h-[300px] border-0 shadow-lg">
            <img 
              src="/lovable-uploads/75191b4e-7f9d-4b72-8a91-ce532a08f527.png" 
              alt="Blog preview" 
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h3 className="text-xl font-semibold mb-2">
                Tips: "Documentation best practices for modern development"
              </h3>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;