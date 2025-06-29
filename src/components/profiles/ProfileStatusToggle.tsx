import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX } from "lucide-react";

interface ProfileStatusToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const ProfileStatusToggle: React.FC<ProfileStatusToggleProps> = ({
  isActive,
  onToggle
}) => {
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    
    toast({
      title: checked ? "Perfil activado" : "Perfil desactivado",
      description: checked 
        ? "Tu perfil es ahora público y visible para otros usuarios."
        : "Tu perfil ha sido ocultado. Has indicado que ya tienes compañero.",
      duration: 1500
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {isActive ? (
                <UserCheck className="h-5 w-5 text-green-500" />
              ) : (
                <UserX className="h-5 w-5 text-muted-foreground" />
              )}
              <h4 className="font-medium">Estado del perfil</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {isActive 
                ? "Tu perfil está visible y buscando compañeros"
                : "Tu perfil está oculto porque ya tienes compañero"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="profile-status" className="sr-only">
              Estado del perfil
            </Label>
            <Switch
              id="profile-status"
              checked={isActive}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatusToggle;
