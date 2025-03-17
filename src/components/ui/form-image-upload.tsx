
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
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

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
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ImageUpload
              multiple={multiple}
              value={field.value}
              onChange={(value) => {
                if (onChange) {
                  // Use a type assertion here to fix the type mismatch
                  onChange(field as ControllerRenderProps<TFieldValues, Path<TFieldValues>>, value);
                } else {
                  field.onChange(value);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
