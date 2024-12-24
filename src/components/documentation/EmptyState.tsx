import React from "react";
import { FileTextIcon } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100">
      <div className="p-4 rounded-full bg-gray-50 w-fit mx-auto mb-4">
        <FileTextIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">No documentation generated yet</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Configure your API key and use the generate button to create documentation
      </p>
    </div>
  );
};

export default EmptyState;