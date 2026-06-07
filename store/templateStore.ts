import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/types/evaluation";

interface TemplateState {
  templates: Template[];
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => Template | undefined;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        })),
      getTemplate: (id) => get().templates.find((template) => template.id === id),
    }),
    {
      name: "template-storage",
    }
  )
);
