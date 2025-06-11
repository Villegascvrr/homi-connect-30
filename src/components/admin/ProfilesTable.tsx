
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Eye, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ProfilesTable = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileStats, setProfileStats] = useState({
    total: 0,
    complete: 0,
    incomplete: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch all profiles from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          
          // Clean and sanitize profile data - ensure all text fields are strings, not null
          const cleanedData = data.map(profile => {
            return {
              ...profile,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              username: profile.username || '',
              email: profile.email || '',
              bio: profile.bio || '',
              edad: profile.edad || '',
              // Change this line to fix the TypeScript error
              // Using location data from the correct field
              location: profile.universidad || '', // Use universidad as a fallback for location
              universidad: profile.universidad || '',
              ocupacion: profile.ocupacion || '',
              sevilla_zona: profile.sevilla_zona || '',
              companeros_count: profile.companeros_count || ''
            };
          });
          
          setProfiles(cleanedData);
          
          // Calculate stats
          const total = cleanedData.length;
          const complete = cleanedData.filter(profile => 
            profile.first_name && 
            profile.last_name && 
            profile.bio && 
            profile.sevilla_zona && 
            profile.companeros_count
          ).length;
          
          setProfileStats({
            total,
            complete,
            incomplete: total - complete
          });
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error al cargar perfiles",
          description: "No se pudieron cargar los perfiles. Inténtalo de nuevo más tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [toast]);

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(profile => {
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      fullName.includes(searchLower) || 
      (profile.username && profile.username.toLowerCase().includes(searchLower)) ||
      (profile.email && profile.email.toLowerCase().includes(searchLower)) ||
      (profile.sevilla_zona && profile.sevilla_zona.toLowerCase().includes(searchLower))
    );
  });

  // Format empty or null values
  const formatValue = (value: any, defaultText = 'No especificado') => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic text-xs">{defaultText}</span>;
    }
    
    if (value === 'no_busco') {
      return <Badge variant="outline">No busca</Badge>;
    }
    
    return value;
  };

  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cargando perfiles...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Perfiles registrados</CardTitle>
          <CardDescription>
            Total: {profileStats.total} perfiles ({profileStats.complete} completos, {profileStats.incomplete} incompletos)
          </CardDescription>
          <div className="flex items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar perfiles..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Zona de Sevilla</TableHead>
                  <TableHead>Compañeros</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No se encontraron perfiles
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => {
                    const isIncomplete = !profile.bio || !profile.sevilla_zona || !profile.companeros_count;
                    
                    return (
                      <TableRow key={profile.id} className={isIncomplete ? "bg-amber-50" : ""}>
                        <TableCell className="font-medium">
                          {formatValue(`${profile.first_name || ''} ${profile.last_name || ''}`.trim(), 'Sin nombre')}
                          {isIncomplete && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertCircle size={14} className="text-amber-500" />
                              <span className="text-amber-500 text-xs">Perfil incompleto</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{formatValue(profile.username)}</TableCell>
                        <TableCell>{formatValue(profile.email)}</TableCell>
                        <TableCell>
                          {formatValue(profile.bio ? 
                            profile.bio.length > 30 ? profile.bio.substring(0, 30) + '...' : profile.bio 
                            : null)}
                        </TableCell>
                        <TableCell>
                          {formatValue(profile.sevilla_zona)}
                        </TableCell>
                        <TableCell>{formatValue(profile.companeros_count)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(profile.id)}
                          >
                            <Eye size={16} className="mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilesTable;
