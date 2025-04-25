import { useState, useRef, useEffect } from "react";
import { Doctor } from "@/types/doctor";
import { getMatchingSearchSuggestions } from "@/utils/filters";

interface SearchBarProps {
  doctors: Doctor[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar = ({ doctors, searchQuery, onSearchChange }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update suggestions when search query changes
    if (searchQuery) {
      setSuggestions(getMatchingSearchSuggestions(doctors, searchQuery));
    } else {
      setSuggestions([]);
    }
  }, [doctors, searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current !== event.target
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSuggestionClick = (doctorName: string) => {
    onSearchChange(doctorName);
    setIsFocused(false);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={searchInputRef}
        type="text"
        data-testid="autocomplete-input"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        placeholder="Search doctors by name..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onKeyPress={handleInputKeyPress}
      />
      
      {/* Autocomplete Suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(doctor.name)}
            >
              {doctor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
