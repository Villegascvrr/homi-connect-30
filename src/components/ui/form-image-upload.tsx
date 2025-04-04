
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
  required?: boolean;
  onChange?: (value: string | string[]) => void;
}

export function FormImageUpload<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  multiple = false,
  className,
  required = false,
  onChange: customOnChange,
}: FormImageUploadProps<TFieldValues>) {
  // Get form context to log state for debugging
  const formContext = useFormContext();
  
  console.log(`Form image upload rendering for field: ${name}`, { 
    formValues: formContext?.getValues(),
    fieldValue: formContext?.getValues(name as any)
  });
  
  // Make sure this component is only used within a form context
  if (!formContext) {
    console.error("FormImageUpload must be used within a Form component");
    // Return a simplified version when no form context is available
    return (
      <div className={className}>
        {label && <div className="mb-2 font-medium">{label}</div>}
        <ImageUpload
          multiple={multiple}
          value={multiple ? [] : ''}
          onChange={(value) => {
            if (customOnChange) customOnChange(value);
          }}
          disableCompression={!multiple}
          enableCropping={!multiple}
        />
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </div>
    );
  }
  
  return (
    <FormField
      name={name}
      render={({ field }) => {
        console.log(`FormField render for ${name}:`, field.value);
        
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <ImageUpload
                multiple={multiple}
                value={field.value || (multiple ? [] : '')}
                onChange={(value) => {
                  console.log(`Image upload onChange for ${name}:`, value);
                  if (customOnChange) {
                    customOnChange(value);
                  } else {
                    field.onChange(value);
                  }
                }}
                onBlur={field.onBlur}
                disableCompression={!multiple}
                enableCropping={!multiple}
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
