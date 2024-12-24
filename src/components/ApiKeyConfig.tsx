import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Key, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type ApiProvider = "groq" | "openai" | "anthropic" | "cohere";

interface ApiKeyConfigProps {
  selectedProvider: ApiProvider;
  onProviderChange: Dispatch<SetStateAction<ApiProvider>>;
}

const ApiKeyConfig = ({ selectedProvider, onProviderChange }: ApiKeyConfigProps) => {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem(`${selectedProvider}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setApiKey("");
    }
  }, [selectedProvider]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    localStorage.setItem(`${selectedProvider}_api_key`, apiKey);
    toast.success(`${selectedProvider.toUpperCase()} API key saved successfully`);
  };

  const providers = [
    { value: "groq", label: "Groq AI" },
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "cohere", label: "Cohere" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-emerald-600" />
        <Label htmlFor="apiProvider" className="font-medium text-lg">
          Configure API Provider
        </Label>
      </div>
      
      <div className="space-y-4">
        <Select value={selectedProvider} onValueChange={(value) => onProviderChange(value as ApiProvider)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select API provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Enter your ${selectedProvider.toUpperCase()} API key`}
            className="bg-gray-50 border-gray-200"
          />
          <p className="text-sm text-gray-500">
            Enter your {selectedProvider.toUpperCase()} API key to enable AI-powered documentation generation
          </p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700"
      >
        <Save className="h-4 w-4" />
        Save API Key
      </Button>
    </div>
  );
};

export default ApiKeyConfig;