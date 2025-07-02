import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sparkles, Cigarette, Dog, Users } from "lucide-react";

interface ProfileLifestyleProps {
  form: any;
}

const ProfileLifestyle = ({ form }: ProfileLifestyleProps) => {
  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="text-homi-purple" size={20} />
          Estilo de vida<span className="text-red-500">*</span>{" "}
          <span className="text-gray-500 text-md">(obligatorio)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedule Preference */}
        <FormField
          control={form.control}
          name="lifestyle.schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="text-homi-purple" size={18} />
                Horario
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Prefieres mañanas o noches?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning_person">Madrugador/a</SelectItem>
                  <SelectItem value="night_owl">Noctámbulo/a</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cleanliness */}
        <FormField
          control={form.control}
          name="lifestyle.cleanliness"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Sparkles className="text-homi-purple" size={18} />
                Limpieza
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cómo eres con la limpieza?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="very_clean">Muy ordenado/a</SelectItem>
                  <SelectItem value="clean">Ordenado/a</SelectItem>
                  <SelectItem value="moderate">Moderado/a</SelectItem>
                  <SelectItem value="relaxed">Relajado/a</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Smoking */}
        <FormField
          control={form.control}
          name="lifestyle.smoking"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Cigarette className="text-homi-purple" size={18} />
                Fumar
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Fumas?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="non_smoker">No fumo</SelectItem>
                  <SelectItem value="outdoor_only">
                    Solo fumo en exteriores
                  </SelectItem>
                  <SelectItem value="smoker">Soy fumador/a</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pets */}
        <FormField
          control={form.control}
          name="lifestyle.pets"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Dog className="text-homi-purple" size={18} />
                Mascotas
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Tienes o te gustan las mascotas?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_pets">No tengo mascotas</SelectItem>
                  <SelectItem value="has_pets">Tengo mascotas</SelectItem>
                  <SelectItem value="pets_welcome">
                    Me encantan las mascotas
                  </SelectItem>
                  <SelectItem value="no_pets_allowed">
                    Prefiero sin mascotas
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Guests */}
        <FormField
          control={form.control}
          name="lifestyle.guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Users className="text-homi-purple" size={18} />
                Visitas
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Sueles invitar a gente?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rarely">Casi nunca</SelectItem>
                  <SelectItem value="occasionally">Ocasionalmente</SelectItem>
                  <SelectItem value="frequently">Frecuentemente</SelectItem>
                  <SelectItem value="no_problem">No me importa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileLifestyle;
