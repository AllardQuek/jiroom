"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCriterionSchema,
  CriterionFormData,
} from "@/lib/schemas/templateSchema";
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
import { Plus, Trash2 } from "lucide-react";

interface CriteriaFormProps {
  defaultValues?: Partial<CriterionFormData>;
  categories: string[];
  onSubmit: (data: CriterionFormData) => void;
  onCancel: () => void;
}

export function CriteriaForm({
  defaultValues,
  categories,
  onSubmit,
  onCancel,
}: CriteriaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CriterionFormData>({
    resolver: zodResolver(createCriterionSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      type: "select",
      category: categories[0] || "",
      options: [],
      scores: {},
      thresholds: [],
      ...defaultValues,
    },
  });

  const watchType = form.watch("type");
  const watchOptions = form.watch("options");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "thresholds",
  });

  // Initialize default scores when options change
  useEffect(() => {
    const currentScores = form.getValues("scores") || {};
    const newScores: Record<string, -1 | 0 | 1> = {};
    for (const opt of watchOptions || []) {
      newScores[opt] = currentScores[opt] ?? 0;
    }
    form.setValue("scores", newScores);
  }, [watchOptions?.join(","), form]);

  const handleSubmit = async (data: CriterionFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit({
        ...data,
        scores:
          data.scores && Object.keys(data.scores).length > 0
            ? data.scores
            : undefined,
        thresholds:
          data.thresholds && data.thresholds.length > 0
            ? data.thresholds
            : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setScoreForOption = (option: string, score: -1 | 0 | 1) => {
    const current = form.getValues("scores") || {};
    form.setValue("scores", { ...current, [option]: score });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Room size" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Brief description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="checkbox">Checkbox (Yes/No)</SelectItem>
                  <SelectItem value="rating">Rating (1-5)</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="select">Select (Dropdown)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === "select" && (
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Options (comma-separated) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Option 1, Option 2, Option 3"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(",").map((o) => o.trim())
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchOptions ?? []).length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Score mapping per option
                </Label>
                {watchOptions
                  ?.filter((o) => o)
                  .map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-between rounded-md border px-3 py-1.5"
                    >
                      <span className="text-sm font-medium">{option}</span>
                      <div className="flex gap-1">
                        {([-1, 0, 1] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setScoreForOption(option, val)}
                            className={`h-6 w-8 rounded text-xs font-medium transition-colors ${
                              (form.watch("scores")?.[option] ?? 0) === val
                                ? val === 1
                                  ? "bg-emerald-100 text-emerald-700"
                                  : val === -1
                                    ? "bg-red-100 text-red-700"
                                    : "bg-muted text-muted-foreground"
                                : "bg-transparent text-muted-foreground/40 hover:text-foreground"
                            }`}
                          >
                            {val > 0 ? "+1" : val < 0 ? "-1" : "0"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {watchType === "number" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Scoring thresholds</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ min: undefined, max: undefined, score: 0 })
                }
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add range
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No thresholds defined — this criterion will not contribute to
                the score.
              </p>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-1.5 flex-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="h-7 w-16 text-xs"
                      {...form.register(`thresholds.${index}.min`, {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                    />
                    <span className="text-xs text-muted-foreground">
                      &ndash;
                    </span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="h-7 w-16 text-xs"
                      {...form.register(`thresholds.${index}.max`, {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                    />
                  </div>

                  <div className="flex gap-1">
                    {([-1, 0, 1] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          form.setValue(`thresholds.${index}.score`, val)
                        }
                        className={`h-6 w-8 rounded text-xs font-medium transition-colors ${
                          form.watch(`thresholds.${index}.score`) === val
                            ? val === 1
                              ? "bg-emerald-100 text-emerald-700"
                              : val === -1
                                ? "bg-red-100 text-red-700"
                                : "bg-muted text-muted-foreground"
                            : "bg-transparent text-muted-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {val > 0 ? "+1" : val < 0 ? "-1" : "0"}
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Criteria"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
