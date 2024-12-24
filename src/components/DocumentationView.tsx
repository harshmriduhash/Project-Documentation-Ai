import React, { useState, useEffect } from "react";
import { CardContent } from "./ui/card";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";
import DocumentationHeader from "./documentation/DocumentationHeader";
import DocumentationSection from "./documentation/DocumentationSection";
import DocumentationToolbar from "./documentation/DocumentationToolbar";
import EmptyState from "./documentation/EmptyState";
import { useDocumentationState } from "../hooks/useDocumentationState";
import { useDocumentationActions } from "../hooks/useDocumentationActions";

interface Props {
  content?: string;
  isLoading?: boolean;
  originalCode?: string;
  onRefresh?: (style: "concise" | "detailed") => void;
  onRegeneratePart?: (section: string, style: "concise" | "detailed", userInput?: string) => Promise<string>;
}

const DocumentationView: React.FC<Props> = ({ 
  content = "", 
  isLoading, 
  originalCode, 
  onRefresh, 
  onRegeneratePart 
}) => {
  const {
    copied,
    docStyle,
    sections,
    selectedStyle,
    searchQuery,
    currentVersion,
    versions,
    filteredSections,
    setDocStyle
  } = useDocumentationState(content);

  const {
    handleCopy,
    handleSearch,
    handleExport,
    handleVersionChange,
    handleRegenerateSection
  } = useDocumentationActions({
    content,
    sections,
    onRefresh,
    onRegeneratePart
  });

  if (isLoading) {
    return (
      <CardContent className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <LoadingSpinner />
      </CardContent>
    );
  }

  return (
    <CardContent className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl">
      <DocumentationHeader
        onCopy={handleCopy}
        copied={copied}
        docStyle={docStyle}
        setDocStyle={setDocStyle}
        onRefresh={onRefresh ? () => onRefresh(docStyle) : undefined}
      />

      <DocumentationToolbar
        onSearch={handleSearch}
        onExport={handleExport}
        onVersionChange={handleVersionChange}
        versions={versions}
        currentVersion={currentVersion}
      />

      <div className="p-6 md:p-8">
        {filteredSections.length > 0 ? (
          <div className="space-y-6">
            {filteredSections.map((section, index) => (
              <DocumentationSection
                key={index}
                title={section.title}
                content={section.content}
                isRegenerating={section.isRegenerating || false}
                selectedStyle={docStyle}
                onStyleChange={setDocStyle}
                onRegenerate={(userInput) => handleRegenerateSection(index, userInput)}
                regenerationProgress={section.regenerationProgress}
                originalCode={originalCode}
              />
            ))}
          </div>
        ) : (
          searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <EmptyState />
          )
        )}
      </div>
    </CardContent>
  );
};

export default DocumentationView;