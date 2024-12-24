import { toast } from "sonner";
import { searchDocumentation, createSearchIndex } from "../utils/documentation/search";
import { exportToPDF, exportToMarkdown } from "../utils/documentation/export";
import { createVersion, storeVersion, getVersion, getVersions } from "../utils/documentation/versioning";

interface Section {
  title: string;
  content: string;
  isRegenerating?: boolean;
  regenerationProgress?: number;
}

interface DocumentationActionsProps {
  content: string;
  sections: Section[];
  onRefresh?: (style: "concise" | "detailed") => void;
  onRegeneratePart?: (section: string, style: "concise" | "detailed", userInput?: string) => Promise<string>;
}

export const useDocumentationActions = ({
  content,
  sections,
  onRefresh,
  onRegeneratePart
}: DocumentationActionsProps) => {
  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      toast.success("Documentation copied to clipboard");
    }
  };

  const setDocStyle = (style: "concise" | "detailed") => {
    // Implementation will be handled by the parent component
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      return sections;
    }
    const searchIndex = createSearchIndex(sections);
    return searchDocumentation(searchIndex, query);
  };

  const handleExport = (format: "pdf" | "md") => {
    if (format === "pdf") {
      exportToPDF(sections);
    } else {
      exportToMarkdown(sections);
    }
  };

  const handleVersionChange = (versionId: string) => {
    const selectedVersion = getVersion(versionId);
    if (selectedVersion) {
      return selectedVersion.sections;
    }
    return sections;
  };

  const handleRegenerateSection = async (index: number, userInput?: string) => {
    if (!onRegeneratePart) return;

    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      isRegenerating: true,
      regenerationProgress: 0
    };

    const updateProgress = setInterval(() => {
      const section = updatedSections[index];
      if (section.regenerationProgress !== undefined && section.regenerationProgress < 90) {
        section.regenerationProgress += 10;
      }
    }, 500);

    try {
      const newContent = await onRegeneratePart(sections[index].content, "detailed", userInput);
      clearInterval(updateProgress);
      
      const originalTitle = sections[index].title;
      const formattedContent = `# ${originalTitle}\n${newContent}`;
      
      updatedSections[index] = {
        ...updatedSections[index],
        content: formattedContent,
        isRegenerating: false,
        regenerationProgress: 100
      };

      const newVersion = createVersion(updatedSections);
      storeVersion(newVersion);
      
      setTimeout(() => {
        updatedSections[index].regenerationProgress = 0;
      }, 1000);
      
      toast.success("Section regenerated successfully");
      return updatedSections;
    } catch (error) {
      clearInterval(updateProgress);
      toast.error("Failed to regenerate section");
      updatedSections[index] = {
        ...updatedSections[index],
        isRegenerating: false,
        regenerationProgress: 0
      };
      return updatedSections;
    }
  };

  return {
    handleCopy,
    setDocStyle,
    handleSearch,
    handleExport,
    handleVersionChange,
    handleRegenerateSection
  };
};