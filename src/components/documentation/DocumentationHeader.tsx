import React from "react";
import { FileText, Copy, Check, RefreshCw, FileTerminal } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  onCopy: () => void;
  copied: boolean;
  docStyle: "concise" | "detailed";
  setDocStyle: (style: "concise" | "detailed") => void;
  onRefresh?: () => void;
}

const DocumentationHeader: React.FC<Props> = ({
  onCopy,
  copied,
  docStyle,
  setDocStyle,
  onRefresh,
}) => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-100 p-3 md:p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-lg text-gray-800">Documentation Preview</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="flex-1 sm:flex-initial group hover:bg-gray-50 border-gray-200"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500 transition-all" />
              ) : (
                <Copy className="h-4 w-4 group-hover:text-gray-700 transition-all" />
              )}
              <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex-1 sm:flex-initial group hover:bg-gray-50 border-gray-200"
              >
                <RefreshCw className="h-4 w-4 group-hover:text-gray-700 transition-all" />
                <span className="ml-2 hidden sm:inline">Refresh All</span>
              </Button>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700 whitespace-nowrap">
              <FileTerminal className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Documentation Style:</span>
            </div>
            <RadioGroup
              value={docStyle}
              onValueChange={(value: "concise" | "detailed") => setDocStyle(value)}
              className="flex gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="concise" className="border-purple-200" />
                <Label htmlFor="concise" className="text-sm cursor-pointer hover:text-purple-600 transition-colors">
                  Concise
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" className="border-purple-200" />
                <Label htmlFor="detailed" className="text-sm cursor-pointer hover:text-purple-600 transition-colors">
                  Detailed
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationHeader;