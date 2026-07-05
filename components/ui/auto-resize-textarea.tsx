"use client";

import { useEffect, useRef, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: string;
  maxHeight?: string;
}

const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ className, minHeight = "60px", maxHeight = "300px", ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef =
    (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      autoResizeTextarea(textarea);
    }
  }, [textareaRef, props.value]);

  return (
    <Textarea
      ref={textareaRef}
      className={cn(
        "resize-none",
        `min-h-[${minHeight}]`,
        `max-h-[${maxHeight}]`,
        className
      )}
      onInput={(e) => autoResizeTextarea(e.currentTarget)}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export { AutoResizeTextarea };
