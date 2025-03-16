
import { Property, PropertyFilter } from '@/types/property';

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento moderno cerca de la universidad',
    description: 'Hermoso apartamento de 2 habitaciones con vistas a la ciudad. Ideal para estudiantes universitarios. Cuenta con electrodomésticos nuevos y abundante luz natural.',
    price: 850,
    address: 'Calle Alcalá 123',
    city: 'Madrid',
    zipCode: '28001',
    size: 70,
    rooms: 2,
    bathrooms: 1,
    furnished: true,
    availability: '2023-08-15',
    type: 'apartment',
    amenities: ['Wifi', 'Lavadora', 'Aire acondicionado', 'Calefacción', 'Ascensor'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
    ],
    coordinates: {
      lat: 40.4168,
      lng: -3.7038
    },
    landlord: {
      id: 'l1',
      name: 'Ana García',
      phone: '+34 600 123 456',
      email: 'ana.garcia@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    createdAt: '2023-07-01T12:00:00Z',
    updatedAt: '2023-07-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Habitación amplia en piso compartido',
    description: 'Habitación individual con baño privado en piso compartido con 3 estudiantes. Ambiente tranquilo y agradable.',
    price: 350,
    address: 'Calle Gran Vía 45',
    city: 'Madrid',
    zipCode: '28013',
    size: 14,
    rooms: 1,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-01',
    type: 'room',
    amenities: ['Wifi', 'Lavadora', 'Cocina compartida', 'Calefacción'],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
    ],
    coordinates: {
      lat: 40.4200,
      lng: -3.7025
    },
    landlord: {
      id: 'l2',
      name: 'Miguel Rodríguez',
      phone: '+34 600 789 123',
      email: 'miguel.rodriguez@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    createdAt: '2023-06-20T15:45:00Z',
    updatedAt: '2023-07-10T09:15:00Z'
  },
  {
    id: '3',
    title: 'Estudio céntrico renovado',
    description: 'Estudio completamente reformado en el corazón de Barcelona. A 5 minutos a pie de la Universidad de Barcelona.',
    price: 650,
    address: 'Carrer de Balmes 78',
    city: 'Barcelona',
    zipCode: '08007',
    size: 35,
    rooms: 0,
    bathrooms: 1,
    furnished: true,
    availability: '2023-08-01',
    type: 'studio',
    amenities: ['Wifi', 'Smart TV', 'Aire acondicionado', 'Lavadora'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be'
    ],
    coordinates: {
      lat: 41.3874,
      lng: 2.1686
    },
    landlord: {
      id: 'l3',
      name: 'Laura Martínez',
      phone: '+34 600 456 789',
      email: 'laura.martinez@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    createdAt: '2023-06-15T11:30:00Z',
    updatedAt: '2023-07-05T14:20:00Z'
  },
  {
    id: '4',
    title: 'Casa con jardín para compartir',
    description: 'Amplia casa de 4 habitaciones con jardín y terraza. Ideal para estudiantes o jóvenes profesionales.',
    price: 1200,
    address: 'Calle Príncipe de Vergara 210',
    city: 'Madrid',
    zipCode: '28002',
    size: 120,
    rooms: 4,
    bathrooms: 2,
    furnished: true,
    availability: '2023-09-15',
    type: 'house',
    amenities: ['Wifi', 'Jardín', 'Terraza', 'Lavadora', 'Secadora', 'Lavavajillas'],
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
    ],
    coordinates: {
      lat: 40.4380,
      lng: -3.6773
    },
    landlord: {
      id: 'l4',
      name: 'Carlos Sánchez',
      phone: '+34 600 321 654',
      email: 'carlos.sanchez@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    createdAt: '2023-07-10T10:15:00Z',
    updatedAt: '2023-07-20T16:40:00Z'
  },
  {
    id: '5',
    title: 'Apartamento luminoso cerca del campus',
    description: 'Bonito apartamento con 2 dormitorios y balcón, a solo 10 minutos a pie de la Universidad Complutense.',
    price: 780,
    address: 'Calle Guzmán el Bueno 56',
    city: 'Madrid',
    zipCode: '28015',
    size: 65,
    rooms: 2,
    bathrooms: 1,
    furnished: true,
    availability: '2023-08-30',
    type: 'apartment',
    amenities: ['Wifi', 'Lavadora', 'Calefacción', 'Balcón'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8'
    ],
    coordinates: {
      lat: 40.4352,
      lng: -3.7130
    },
    landlord: {
      id: 'l5',
      name: 'Elena López',
      phone: '+34 600 987 654',
      email: 'elena.lopez@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg'
    },
    createdAt: '2023-06-25T14:00:00Z',
    updatedAt: '2023-07-12T11:10:00Z'
  },
  {
    id: '6',
    title: 'Habitación doble en piso céntrico',
    description: 'Habitación doble en piso compartido con otros dos estudiantes. Ubicado en pleno centro, cerca de todas las comodidades.',
    price: 400,
    address: 'Calle Fuencarral 32',
    city: 'Madrid',
    zipCode: '28004',
    size: 18,
    rooms: 1,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-01',
    type: 'room',
    amenities: ['Wifi', 'Lavadora', 'Calefacción', 'Armario empotrado'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f',
      'https://images.unsplash.com/photo-1585128792020-803d29415281'
    ],
    coordinates: {
      lat: 40.4256,
      lng: -3.7024
    },
    landlord: {
      id: 'l6',
      name: 'Pedro González',
      phone: '+34 600 543 210',
      email: 'pedro.gonzalez@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    createdAt: '2023-07-05T09:30:00Z',
    updatedAt: '2023-07-18T13:20:00Z'
  },
  {
    id: '7',
    title: 'Apartamento de lujo en zona universitaria',
    description: 'Moderno apartamento de 3 habitaciones en zona universitaria. Totalmente equipado y con excelentes conexiones de transporte.',
    price: 1100,
    address: 'Avenida Diagonal 330',
    city: 'Barcelona',
    zipCode: '08013',
    size: 90,
    rooms: 3,
    bathrooms: 2,
    furnished: true,
    availability: '2023-08-20',
    type: 'apartment',
    amenities: ['Wifi', 'Aire acondicionado', 'Calefacción', 'Lavavajillas', 'Smart TV', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c'
    ],
    coordinates: {
      lat: 41.3980,
      lng: 2.1748
    },
    landlord: {
      id: 'l7',
      name: 'Sofía Ramírez',
      phone: '+34 600 678 901',
      email: 'sofia.ramirez@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    createdAt: '2023-06-28T16:20:00Z',
    updatedAt: '2023-07-14T10:45:00Z'
  },
  {
    id: '8',
    title: 'Estudio económico para estudiantes',
    description: 'Acogedor estudio ideal para estudiantes con presupuesto limitado. Equipado con lo esencial y bien comunicado.',
    price: 450,
    address: 'Calle Cartagena 128',
    city: 'Madrid',
    zipCode: '28002',
    size: 25,
    rooms: 0,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-05',
    type: 'studio',
    amenities: ['Wifi', 'Lavadora', 'Microondas', 'Nevera'],
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb',
      'https://images.unsplash.com/photo-1625585598750-3d2c8f6fa155'
    ],
    coordinates: {
      lat: 40.4384,
      lng: -3.6703
    },
    landlord: {
      id: 'l8',
      name: 'Javier Torres',
      phone: '+34 600 345 678',
      email: 'javier.torres@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    createdAt: '2023-07-08T13:40:00Z',
    updatedAt: '2023-07-19T15:25:00Z'
  },
  {
    id: '9',
    title: 'Habitación individual en piso tranquilo',
    description: 'Habitación individual en piso compartido con dos profesionales. Ambiente tranquilo ideal para estudiar.',
    price: 320,
    address: 'Calle Atocha 88',
    city: 'Madrid',
    zipCode: '28012',
    size: 12,
    rooms: 1,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-10',
    type: 'room',
    amenities: ['Wifi', 'Escritorio', 'Armario', 'Cocina equipada'],
    images: [
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be',
      'https://images.unsplash.com/photo-1618220179428-22790b461013'
    ],
    coordinates: {
      lat: 40.4124,
      lng: -3.6930
    },
    landlord: {
      id: 'l9',
      name: 'María Fernández',
      phone: '+34 600 234 567',
      email: 'maria.fernandez@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    createdAt: '2023-07-03T11:15:00Z',
    updatedAt: '2023-07-16T14:10:00Z'
  },
  {
    id: '10',
    title: 'Casa compartida con jardín y piscina',
    description: 'Habitación en casa compartida con jardín y piscina. Ambiente internacional con estudiantes de diferentes países.',
    price: 550,
    address: 'Calle Arturo Soria 285',
    city: 'Madrid',
    zipCode: '28033',
    size: 16,
    rooms: 1,
    bathrooms: 1,
    furnished: true,
    availability: '2023-08-25',
    type: 'room',
    amenities: ['Wifi', 'Piscina', 'Jardín', 'Aire acondicionado', 'Lavadora', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7'
    ],
    coordinates: {
      lat: 40.4641,
      lng: -3.6497
    },
    landlord: {
      id: 'l10',
      name: 'David Navarro',
      phone: '+34 600 876 543',
      email: 'david.navarro@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    createdAt: '2023-06-30T10:05:00Z',
    updatedAt: '2023-07-17T16:30:00Z'
  },
  {
    id: '11',
    title: 'Ático con terraza cerca de UAM',
    description: 'Espectacular ático con terraza panorámica, a 15 minutos de la Universidad Autónoma de Madrid.',
    price: 900,
    address: 'Calle Mateo Inurria 15',
    city: 'Madrid',
    zipCode: '28036',
    size: 75,
    rooms: 2,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-01',
    type: 'apartment',
    amenities: ['Wifi', 'Terraza', 'Aire acondicionado', 'Calefacción', 'Lavadora', 'Ascensor'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1599327286062-46ba25ee0fe7',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'
    ],
    coordinates: {
      lat: 40.4777,
      lng: -3.6835
    },
    landlord: {
      id: 'l11',
      name: 'Isabel Castro',
      phone: '+34 600 432 198',
      email: 'isabel.castro@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
    },
    createdAt: '2023-07-11T14:25:00Z',
    updatedAt: '2023-07-21T12:50:00Z'
  },
  {
    id: '12',
    title: 'Habitación en residencia estudiantil',
    description: 'Habitación individual en residencia estudiantil con servicios comunes. Incluye limpieza semanal y desayuno.',
    price: 550,
    address: 'Calle Alberto Aguilera 23',
    city: 'Madrid',
    zipCode: '28015',
    size: 10,
    rooms: 1,
    bathrooms: 1,
    furnished: true,
    availability: '2023-09-15',
    type: 'room',
    amenities: ['Wifi', 'Desayuno incluido', 'Limpieza', 'Sala de estudio', 'Gimnasio'],
    images: [
      'https://images.unsplash.com/photo-1626257426758-bca6c5cb8182',
      'https://images.unsplash.com/photo-1611892441796-ae6af0ec2cc8'
    ],
    coordinates: {
      lat: 40.4291,
      lng: -3.7098
    },
    landlord: {
      id: 'l12',
      name: 'Residencia Universitaria San Agustín',
      phone: '+34 900 123 456',
      email: 'info@residenciasanagustin.com',
      avatar: 'https://randomuser.me/api/portraits/men/90.jpg'
    },
    createdAt: '2023-07-07T09:10:00Z',
    updatedAt: '2023-07-18T11:35:00Z'
  }
];

// Function to get all properties
export const getProperties = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProperties);
    }, 500);
  });
};

// Function to get a property by ID
export const getPropertyById = (id: string): Promise<Property | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const property = mockProperties.find(p => p.id === id) || null;
      resolve(property);
    }, 300);
  });
};

// Function to filter properties based on criteria
export const filterProperties = (filters: PropertyFilter): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProperties = [...mockProperties];

      if (filters.minPrice !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.city) {
        filteredProperties = filteredProperties.filter(p => 
          p.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }

      if (filters.type && filters.type !== 'all') {
        filteredProperties = filteredProperties.filter(p => p.type === filters.type);
      }

      if (filters.rooms !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.rooms >= filters.rooms!);
      }

      if (filters.bathrooms !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathrooms!);
      }

      if (filters.furnished !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.furnished === filters.furnished);
      }

      if (filters.minSize !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.size >= filters.minSize!);
      }

      if (filters.maxSize !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.size <= filters.maxSize!);
      }

      if (filters.amenities && filters.amenities.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          filters.amenities!.every(amenity => p.amenities.includes(amenity))
        );
      }

      resolve(filteredProperties);
    }, 500);
  });
};

// Get unique cities from properties
export const getUniqueCities = async (): Promise<string[]> => {
  const properties = await getProperties();
  const cities = [...new Set(properties.map(p => p.city))];
  return cities;
};
