
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProfileSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const ProfileSearchBar: React.FC<ProfileSearchBarProps> = ({
  onSearch,
  placeholder = "Buscar por nombre, apellidos o usuario...",
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-20 w-full rounded-full"
        />
        <Button 
          type="submit" 
          className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full px-4 h-8"
          size="sm"
        >
          Buscar
        </Button>
      </div>
    </form>
  );
};

export default ProfileSearchBar;
