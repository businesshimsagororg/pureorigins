import React, { useState } from 'react';
import Image from 'next/image';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic or navigate to /shop?search=query
    console.log('Search:', query);
  };
  return (
    <form onSubmit={handleSubmit} className="search-bar" aria-label="Search products">
      <input
        type="search"
        placeholder="পণ্য অনুসন্ধান..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        aria-label="Search input"
      />
      <button type="submit" className="search-btn" aria-label="Search button">
        {/* magnifying glass SVG */}
        <svg className="svg-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </form>
  );
}
