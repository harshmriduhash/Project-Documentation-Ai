import Fuse from 'fuse.js';

interface SearchableSection {
  title: string;
  content: string;
}

export const createSearchIndex = (sections: SearchableSection[]) => {
  return new Fuse(sections, {
    keys: ['title', 'content'],
    threshold: 0.3,
    includeScore: true,
    useExtendedSearch: true,
  });
};

export const searchDocumentation = (searchIndex: Fuse<SearchableSection>, query: string) => {
  if (!query.trim()) return [];
  return searchIndex.search(query);
};