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
import { useAuth } from '@/context/AuthContext';

interface FormImageUploadProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  hideLabel?: boolean;
}

export function FormImageUpload<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  required = false,
  onChange: customOnChange,
  hideLabel = false,
}: FormImageUploadProps<TFieldValues>) {
  // Get form context to log state for debugging
  const formContext = useFormContext();
  const { user } = useAuth();
  
  // Make sure this component is only used within a form context
  if (!formContext) {
    console.error("FormImageUpload must be used within a Form component");
    // Return a simplified version when no form context is available
    return (
      <div className={className}>
        {label && !hideLabel && <div className="mb-2 font-medium">{label}</div>}
        <ImageUpload
          value={''}
          userId={user.id}
          profileImageId={user.profile_image_id}
          onChange={(value) => {
            if (customOnChange) customOnChange(value);
          }}
          disableCompression={true}
          enableCropping={false}
        />
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </div>
    );
  }

  return (
    <FormField
      name={name}
      render={({ field }) => {
        
        return (
          <FormItem className={className}>
            {label && !hideLabel && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <ImageUpload
                value={field.value || ''}
                onChange={(value) => {
                  if (customOnChange) {
                    customOnChange(value);
                  } else {
                    field.onChange(value);
                  }
                }}
                onBlur={field.onBlur}
                disableCompression={true}
                enableCropping={false}
                profileImageId={user.profile_image_id}
                userId={user?.id || ''}
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
