import { useState, useEffect } from "react";
import Fuse from 'fuse.js';
import { createSearchIndex } from "../utils/documentation/search";
import { createVersion, storeVersion, getVersions } from "../utils/documentation/versioning";

interface Section {
  title: string;
  content: string;
  isRegenerating?: boolean;
  regenerationProgress?: number;
}

export const useDocumentationState = (content: string) => {
  const [copied, setCopied] = useState(false);
  const [docStyle, setDocStyle] = useState<"concise" | "detailed">("detailed");
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<"concise" | "detailed">("detailed");
  const [searchIndex, setSearchIndex] = useState<Fuse<Section> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [versions, setVersions] = useState<{ id: string; date: string }[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);

  useEffect(() => {
    if (content) {
      const parts = content.split(/(?=# )/g).filter(Boolean);
      const parsedSections = parts.map(part => {
        const titleMatch = part.match(/^# (.*?)(?:\n|$)/);
        return {
          title: titleMatch ? titleMatch[1] : "Untitled Section",
          content: part.trim(),
          regenerationProgress: 0
        };
      });
      setSections(parsedSections);
      setFilteredSections(parsedSections);

      const index = createSearchIndex(parsedSections);
      setSearchIndex(index);

      const newVersion = createVersion(parsedSections);
      storeVersion(newVersion);
      setCurrentVersion(newVersion.id);

      const allVersions = getVersions();
      setVersions(allVersions.map(v => ({ id: v.id, date: v.date })));
    }
  }, [content]);

  return {
    copied,
    setCopied,
    docStyle,
    setDocStyle,
    sections,
    setSections,
    selectedStyle,
    setSelectedStyle,
    searchIndex,
    setSearchIndex,
    searchQuery,
    setSearchQuery,
    currentVersion,
    setCurrentVersion,
    versions,
    setVersions,
    filteredSections,
    setFilteredSections
  };
};