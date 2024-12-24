import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DocumentationPreview: React.FC<Props> = ({ open, onOpenChange, content }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Documentation Preview</h2>
          <p className="text-sm text-gray-500 mt-1">Full documentation view</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600">{children}</ol>
                ),
                code: ({ inline, className, children, ...props }: CodeProps) => {
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="p-4 rounded-lg bg-gray-50 overflow-x-auto mb-4">
                      <code className="text-sm font-mono text-gray-800" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentationPreview;