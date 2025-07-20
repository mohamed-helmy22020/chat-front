import { cn } from "@/lib/utils";
import React from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

type CustomInputType = React.InputHTMLAttributes<HTMLInputElement> & {
  control: any;
  name: any;
  label: string;
  placeholder: string;
};

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputType>(
  (
    { control, name, label, placeholder, type, className, ...otherProps },
    ref,
  ) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div className="form-item min-w-[50%]">
            <FormLabel
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {label}
            </FormLabel>
            <div className="flex w-full flex-col">
              <FormControl>
                <Input
                  placeholder={placeholder}
                  className={cn(
                    "auth-input mt-1 block w-full rounded-xs border-0 bg-[#9191911f] p-3 text-xl tracking-wider text-gray-900 shadow-sm backdrop-blur-lg focus:outline-none focus-visible:ring-0 sm:text-sm dark:text-gray-100",
                    className,
                  )}
                  {...field}
                  type={type}
                  id={name}
                  ref={ref}
                  {...otherProps}
                  dir="ltr"
                ></Input>
              </FormControl>
              <FormMessage className="form-message mt-2" />
            </div>
          </div>
        )}
      />
    );
  },
);

CustomInput.displayName = "CustomInput";
export default CustomInput;
