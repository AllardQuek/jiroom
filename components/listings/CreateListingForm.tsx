import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingFormData } from "@/lib/schemas/listingSchema";
import { useListingStore } from "@/store/listingStore";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateListingForm({ onSuccess, onCancel }: CreateListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addListing = useListingStore((state) => state.addListing);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      source_url: "",
      title: "",
      price: 0,
      area: "",
      source_platform: "",
      status: "new",
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    try {
      const newListing = {
        id: crypto.randomUUID(),
        ...data,
        source_platform: data.source_platform || "",
        area: data.area || "",
        created_at: new Date().toISOString(),
      };
      addListing(newListing);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="source_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL *</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/listing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="2 bedroom apartment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1500"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <FormControl>
                <Input placeholder="Downtown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source_platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Platform</FormLabel>
              <FormControl>
                <Input placeholder="Zillow, Craigslist, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="to_view">To View</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
