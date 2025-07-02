import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Heart } from "lucide-react";

// Predefined list of interests
const INTERESTS_OPTIONS = [
  "Deportes",
  "Música",
  "Cine",
  "Arte",
  "Videojuegos",
  "Gastronomía",
  "Viajes",
  "Literatura",
  "Tecnología",
  "Moda",
  "Fotografía",
  "Naturaleza",
  "Fiesta",
  "Series",
  "Cocina",
  "Teatro",
  "Política",
  "Activismo",
  "Emprendimiento",
];

interface ProfileInterestsProps {
  form: any;
}

const ProfileInterests = ({ form }: ProfileInterestsProps) => {
  const interests = form.watch("interests") || [];

  const handleToggleInterest = (interest: string) => {
    const currentInterests = [...interests];

    if (currentInterests.includes(interest)) {
      const newInterests = currentInterests.filter((i) => i !== interest);
      form.setValue("interests", newInterests);
    } else {
      form.setValue("interests", [...currentInterests, interest]);
    }
  };

  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Heart className="text-homi-purple" size={20} />
          Intereses<span className="text-red-500">*</span>{" "}
          <span className="text-gray-500 text-md">(obligatorio)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Selecciona tus intereses</FormLabel>

          <div className="flex flex-wrap gap-2">
            {INTERESTS_OPTIONS.map((interest) => (
              <div
                key={interest}
                className={`px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm ${
                  interests.includes(interest)
                    ? "bg-homi-purple text-white border-homi-purple"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleToggleInterest(interest)}
              >
                {interest}
              </div>
            ))}
          </div>
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default ProfileInterests;
