import { useState } from "react";
import ApiKeyConfig, { ApiProvider } from "../components/ApiKeyConfig";
import DocumentationView from "../components/DocumentationView";
import { Button } from "../components/ui/button";
import { BookOpen, Sparkles, ArrowRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../components/ui/textarea";
import { generateDocumentation } from "../utils/documentationGenerator";
import { Card } from "../components/ui/card";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import BlogSection from "../components/BlogSection";
import DocumentationPreview from "../components/documentation/DocumentationPreview";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [generatedDocs, setGeneratedDocs] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>("groq");
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateDocumentation = async (style: "concise" | "detailed" = "detailed") => {
    const apiKey = localStorage.getItem(`${selectedProvider}_api_key`);
    
    if (!apiKey) {
      toast.error(`Please configure your ${selectedProvider.toUpperCase()} API key first`);
      return;
    }

    if (!userCode.trim()) {
      toast.error("Please enter some code to generate documentation");
      return;
    }

    setIsGenerating(true);
    try {
      const docs = await generateDocumentation(userCode, selectedProvider, style);
      setGeneratedDocs(docs);
      toast.success("Documentation generated successfully!");
    } catch (error) {
      console.error("Error generating documentation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate documentation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePart = async (section: string, style: "concise" | "detailed") => {
    const apiKey = localStorage.getItem(`${selectedProvider}_api_key`);
    
    if (!apiKey) {
      throw new Error("API key not configured");
    }

    const newContent = await generateDocumentation(section, selectedProvider, style, true, section);
    return newContent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-cyan-50/50 to-blue-50/50 opacity-60" />
      
      {/* Animated Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6 md:space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-4 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-600">AI-Powered Documentation Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 leading-[1.1] animate-fadeIn px-4 max-w-4xl mx-auto">
              Transform Your Code Into Clear Documentation
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-slideIn px-4 leading-relaxed">
              Instantly generate comprehensive documentation with the power of AI. Save time and maintain clarity in your codebase.
            </p>

            <Stats />
          </div>

          <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <div className="p-6 md:p-8 space-y-6">
                  <ApiKeyConfig 
                    selectedProvider={selectedProvider}
                    onProviderChange={setSelectedProvider}
                  />
                </div>
              </Card>

              <Card className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Your Code
                    </label>
                    <Textarea 
                      placeholder="Paste your code here..."
                      className="min-h-[200px] md:min-h-[300px] font-mono text-sm bg-white/50 border-slate-200 resize-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleGenerateDocumentation()}
                        className="flex-1 group flex items-center justify-center gap-2 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                        disabled={isGenerating}
                      >
                        <BookOpen className="h-5 w-5" />
                        {isGenerating ? "Generating Documentation..." : "Generate Documentation"}
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Button>
                      {generatedDocs && (
                        <Button
                          onClick={() => setShowPreview(true)}
                          variant="outline"
                          className="group flex items-center gap-2 border-gray-200"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="hidden sm:inline">Preview</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full">
                <DocumentationView 
                  content={generatedDocs} 
                  isLoading={isGenerating} 
                  onRefresh={handleGenerateDocumentation}
                  onRegeneratePart={handleRegeneratePart}
                />
              </Card>
            </div>
          </div>
        </div>

        <DocumentationPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          content={generatedDocs}
        />

        <Features />
        <Testimonials />
        <BlogSection />
      </div>
    </div>
  );
};

export default Index;
