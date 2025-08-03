import React from 'react';
import { Search } from 'lucide-react';

const Searcher = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-70 max-w-md">
      <div className="flex items-center border-2 text-black rounded-full px-4 py-2 gap-2 shadow-sm bg-transparent">
        <Search className="text-white" size={20} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent text-white"
        />
      </div>
    </div>
  );
};

export default Searcher;
