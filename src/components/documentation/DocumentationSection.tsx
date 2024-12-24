import React, { useState } from "react";
import { FileTextIcon, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";
import { Progress } from "../ui/progress";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
  title: string;
  content: string;
  isRegenerating: boolean;
  selectedStyle: "concise" | "detailed";
  onStyleChange: (style: "concise" | "detailed") => void;
  onRegenerate: (userInput?: string) => void;
  regenerationProgress?: number;
  originalCode?: string;
}

const DocumentationSection: React.FC<Props> = ({
  title,
  content,
  isRegenerating,
  selectedStyle,
  onStyleChange,
  onRegenerate,
  regenerationProgress = 0,
  originalCode,
}) => {
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleRegenerate = () => {
    onRegenerate(userInput);
    setUserInput('');
    setShowInput(false);
  };

  const handleStyleChange = (value: string) => {
    onStyleChange(value as "concise" | "detailed");
  };

  return (
    <Collapsible className="border border-gray-200 rounded-lg overflow-hidden">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 md:p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <FileTextIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
          <span className="font-medium text-gray-800 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {isRegenerating ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <Progress value={regenerationProgress} className="w-16 sm:w-24 h-2" />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowInput(!showInput);
              }}
              className="text-xs hidden sm:flex"
            >
              Regenerate Section
            </Button>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 md:p-4 border-t border-gray-200">
        <div className="prose prose-emerald prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {showInput && (
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder="Enter specific instructions for regeneration (optional)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-24"
            />
            {originalCode && (
              <div className="text-sm text-gray-500 mt-2">
                <p>This section will be regenerated with context from the original code.</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRegenerate}
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm text-gray-600">Section Style:</span>
          <RadioGroup
            value={selectedStyle}
            onValueChange={handleStyleChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id={`concise-${title}`} />
              <Label htmlFor={`concise-${title}`} className="text-sm">Concise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id={`detailed-${title}`} />
              <Label htmlFor={`detailed-${title}`} className="text-sm">Detailed</Label>
            </div>
          </RadioGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInput(!showInput)}
            className="text-xs sm:hidden mt-2 w-full"
          >
            Regenerate Section
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DocumentationSection;