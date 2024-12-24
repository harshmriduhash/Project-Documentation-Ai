interface Version {
  id: string;
  date: string;
  name: string;
  sections: {
    title: string;
    content: string;
  }[];
  metadata: {
    author?: string;
    lastModified: string;
    versionNumber: string;
    changes?: string[];
  };
}

export const createVersion = (
  sections: { title: string; content: string }[],
  metadata?: Partial<Version['metadata']>
): Version => {
  const versionCount = getVersions().length;
  const versionNumber = `1.${versionCount}.0`;

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    name: `Version ${versionNumber}`,
    sections: sections.map(section => ({
      title: section.title,
      content: section.content
    })),
    metadata: {
      lastModified: new Date().toISOString(),
      versionNumber,
      ...metadata
    }
  };
};

export const storeVersion = (version: Version) => {
  const versions = getVersions();
  // Keep only the last 10 versions
  if (versions.length >= 10) {
    versions.shift(); // Remove oldest version
  }
  versions.push(version);
  localStorage.setItem('doc_versions', JSON.stringify(versions));
  return version;
};

export const getVersions = (): Version[] => {
  try {
    const stored = localStorage.getItem('doc_versions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading versions:', error);
    return [];
  }
};

export const getVersion = (versionId: string): Version | undefined => {
  const versions = getVersions();
  return versions.find(v => v.id === versionId);
};

export const compareVersions = (versionA: Version, versionB: Version): Version[] => {
  const changes: Version[] = [];
  const sectionsA = new Map(versionA.sections.map(s => [s.title, s.content]));
  const sectionsB = new Map(versionB.sections.map(s => [s.title, s.content]));

  // Find modified or new sections
  for (const [title, content] of sectionsB) {
    if (!sectionsA.has(title) || sectionsA.get(title) !== content) {
      changes.push({
        ...versionB,
        sections: [{ title, content }],
        metadata: {
          ...versionB.metadata,
          changes: [`Modified or added section: ${title}`]
        }
      });
    }
  }

  // Find removed sections
  for (const [title] of sectionsA) {
    if (!sectionsB.has(title)) {
      changes.push({
        ...versionB,
        sections: [],
        metadata: {
          ...versionB.metadata,
          changes: [`Removed section: ${title}`]
        }
      });
    }
  }

  return changes;
};

export const getVersionHistory = (versionId: string): Version[] => {
  const versions = getVersions();
  const currentVersionIndex = versions.findIndex(v => v.id === versionId);
  
  if (currentVersionIndex === -1) return [];
  
  return versions.slice(0, currentVersionIndex + 1);
};
