
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useFieldArray, Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileInterestsProps {
  form: any;
}

// Define a type for our field items
interface InterestFieldItem {
  id: string;
  value: string;
}

const ProfileInterests = ({ form }: ProfileInterestsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "interests",
  });

  const addInterest = () => {
    const newInterest = form.watch('newInterest');
    if (newInterest && newInterest.trim() !== '') {
      append(newInterest.trim());
      form.setValue('newInterest', '');
    }
  };

  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Intereses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="newInterest"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Añade un interés..." 
                    {...field} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            onClick={addInterest} 
            variant="outline"
            className="bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple hover:text-white"
          >
            <Plus size={16} />
          </Button>
        </div>

        {fields.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className="bg-homi-ultraLightPurple text-homi-purple rounded-full px-3 py-1 text-sm flex items-center gap-1"
              >
                <span>{form.watch(`interests.${index}`)}</span>
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="text-homi-purple hover:text-homi-purple/70 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            Añade intereses para conectar con personas que comparten tus pasatiempos
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInterests;
