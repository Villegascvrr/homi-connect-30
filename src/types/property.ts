
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  zipCode: string;
  size: number;
  rooms: number;
  bathrooms: number;
  furnished: boolean;
  availability: string;
  type: 'apartment' | 'room' | 'house' | 'studio';
  amenities: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  landlord: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  type?: 'apartment' | 'room' | 'house' | 'studio' | 'all';
  rooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  minSize?: number;
  maxSize?: number;
  amenities?: string[];
}
