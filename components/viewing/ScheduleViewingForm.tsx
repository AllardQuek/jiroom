"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createViewingSchema, ViewingFormData } from "@/lib/schemas/viewingSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ScheduleViewingFormProps {
  listingId: string;
  onCancel: () => void;
  onSubmit: (data: ViewingFormData) => void;
}

export function ScheduleViewingForm({
  listingId,
  onCancel,
  onSubmit,
}: ScheduleViewingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ViewingFormData>({
    resolver: zodResolver(createViewingSchema),
    defaultValues: {
      listing_id: listingId,
      status: "to_view",
      scheduled_date: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: ViewingFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="scheduled_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Date & Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add any notes about this viewing"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Schedule Viewing"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
