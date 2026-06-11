import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/types/evaluation";
import { defaultTemplate } from "@/lib/data/defaultTemplate";

interface TemplateState {
  templates: Template[];
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => Template | undefined;
  initializeTemplates: () => void;
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
      getTemplate: (id) =>
        get().templates.find((template) => template.id === id),
      initializeTemplates: () => {
        const { templates } = get();
        const codeIds = defaultTemplate.criteria
          .map((c) => c.id)
          .sort()
          .join(",");
        const existingDefault = templates.find((t) => t.id === "default");
        if (existingDefault) {
          const storedIds = existingDefault.criteria
            .map((c) => c.id)
            .sort()
            .join(",");
          if (storedIds === codeIds) return;
          const others = templates.filter((t) => t.id !== "default");
          set({ templates: [...others, defaultTemplate] });
        } else {
          set({ templates: [...templates, defaultTemplate] });
        }
      },
    }),
    {
      name: "template-storage",
    }
  )
);
