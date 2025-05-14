'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for anime..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
} 