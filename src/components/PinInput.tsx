
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PinInput = ({ 
  length = 6, 
  value = "", 
  onChange, 
  className 
}: PinInputProps) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(newValue);
  };

  // Handle clicking on the PIN field container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2 w-full", 
        className
      )}
      onClick={handleContainerClick}
    >
      {/* Hidden input for actual value */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="sr-only"
        aria-label="PIN input"
      />

      {/* Visual PIN dots */}
      <div className="flex gap-2 w-full">
        {Array.from({ length }).map((_, index) => {
          const isFilled = index < value.length;
          
          return (
            <div
              key={index}
              className={cn(
                "w-full h-12 flex items-center justify-center rounded-md border border-input",
                isFilled ? "bg-primary" : "bg-background",
                focused && index === value.length && "ring-2 ring-ring"
              )}
            >
              {isFilled && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PinInput;
