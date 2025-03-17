
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { ControllerRenderProps, FieldValues, Path, useFormContext } from "react-hook-form";

interface FormImageUploadProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  multiple?: boolean;
  className?: string;
  onChange?: (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>, value: string | string[]) => void;
}

export function FormImageUpload<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  multiple = false,
  className,
  onChange,
}: FormImageUploadProps<TFieldValues>) {
  // Get form context to log state for debugging
  const formContext = useFormContext();
  
  console.log(`Form image upload rendering for field: ${name}`, { 
    formValues: formContext?.getValues(),
    fieldValue: formContext?.getValues(name as any)
  });
  
  return (
    <FormField
      name={name}
      render={({ field }) => {
        console.log(`FormField render for ${name}:`, field.value);
        
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <ImageUpload
                multiple={multiple}
                value={field.value || (multiple ? [] : '')}
                onChange={(value) => {
                  console.log(`Image upload onChange for ${name}:`, value);
                  if (onChange) {
                    onChange(field as any, value);
                  } else {
                    field.onChange(value);
                  }
                }}
                onRemove={() => {
                  if (multiple) {
                    field.onChange([]);
                  } else {
                    field.onChange('');
                  }
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
