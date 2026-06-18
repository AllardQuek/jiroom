"use client";

import { useState, useEffect } from "react";
import { useTenantProfileStore } from "@/store/tenantProfileStore";
import { TenantProfile } from "@/types/tenantProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantProfileFormProps {
  onSave?: () => void;
}

interface ProfileField {
  key: keyof TenantProfile;
  label: string;
  placeholder: string;
  full?: boolean;
}

const profileFields: ProfileField[] = [
  { key: "name", label: "Name", placeholder: "Your name" },
  { key: "occupation", label: "Occupation", placeholder: "Your occupation" },
  { key: "nationality", label: "Nationality", placeholder: "Your nationality" },
  { key: "noOfPax", label: "No. of Pax", placeholder: "Number of people" },
  { key: "gender", label: "Gender", placeholder: "M/F/Other" },
  { key: "pass", label: "Pass", placeholder: "Pass type" },
  { key: "pets", label: "Any pets?", placeholder: "Yes/No" },
  { key: "cooking", label: "Cooking", placeholder: "Yes/No" },
  { key: "workLocation", label: "Work Location", placeholder: "Your work location" },
  { key: "moveInDate", label: "Move in date", placeholder: "Preferred move-in date" },
  { key: "leaseDuration", label: "Lease duration", placeholder: "e.g., 1 year" },
  { key: "budget", label: "Budget", placeholder: "Your budget" },
  { key: "viewing", label: "Viewing availability", placeholder: "e.g., Weekday evenings", full: true },
];

export function TenantProfileForm({ onSave }: TenantProfileFormProps) {
  const profile = useTenantProfileStore((state) => state.profile);
  const updateProfile = useTenantProfileStore((state) => state.updateProfile);

  const [formData, setFormData] = useState<TenantProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof TenantProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    onSave?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {profileFields.map((field) => (
          <div key={field.key} className={`space-y-1.5 ${field.full ? "col-span-2" : ""}`}>
            <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
              {field.label}
            </Label>
            <Input
              id={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end pt-2 border-t">
        <Button size="sm" onClick={handleSave}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}
