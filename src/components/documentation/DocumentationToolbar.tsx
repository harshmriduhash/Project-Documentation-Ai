import React from "react";
import { Search, Download, History, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface Props {
  onSearch: (query: string) => void;
  onExport: (format: "pdf" | "md") => void;
  onVersionChange: (version: string) => void;
  versions: { id: string; date: string }[];
  currentVersion: string;
}

const DocumentationToolbar: React.FC<Props> = ({
  onSearch,
  onExport,
  onVersionChange,
  versions,
  currentVersion,
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documentation..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={currentVersion} onValueChange={onVersionChange}>
            <SelectTrigger className="w-[180px]">
              <History className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {new Date(version.date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              onExport("pdf");
              toast.success("Documentation exported as PDF");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onExport("md");
              toast.success("Documentation exported as Markdown");
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            MD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationToolbar;