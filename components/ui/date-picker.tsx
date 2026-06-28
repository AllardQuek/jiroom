"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (date: string | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  // Convert ISO string to YYYY-MM-DD format for date input
  const formatDateForInput = (isoString?: string): string => {
    if (!isoString) return ""
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Convert YYYY-MM-DD from date input back to ISO string
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (!inputValue) {
      onChange(undefined)
      return
    }
    
    // Parse YYYY-MM-DD and create ISO string at midnight
    const [year, month, day] = inputValue.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    onChange(date.toISOString())
  }

  return (
    <input
      type="date"
      value={formatDateForInput(value)}
      onChange={handleDateChange}
      className={cn(
        "w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}
