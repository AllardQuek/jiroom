import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AgentQuestionTemplate } from "@/types/agentQuestion";
import { defaultAgentQuestions } from "@/lib/data/defaultAgentQuestions";

interface AgentQuestionState {
  templates: AgentQuestionTemplate[];
  activeTemplateId: string | null;
  addTemplate: (template: AgentQuestionTemplate) => void;
  updateTemplate: (id: string, updates: Partial<AgentQuestionTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => AgentQuestionTemplate | undefined;
  setActiveTemplate: (id: string) => void;
  getActiveTemplate: () => AgentQuestionTemplate | undefined;
  initializeTemplates: () => void;
}

export const useAgentQuestionStore = create<AgentQuestionState>()(
  persist(
    (set, get) => ({
      templates: [],
      activeTemplateId: null,
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
          activeTemplateId:
            state.activeTemplateId === id ? null : state.activeTemplateId,
        })),
      getTemplate: (id) =>
        get().templates.find((template) => template.id === id),
      setActiveTemplate: (id) => set({ activeTemplateId: id }),
      getActiveTemplate: () => {
        const { templates, activeTemplateId } = get();
        return templates.find((t) => t.id === activeTemplateId);
      },
      initializeTemplates: () => {
        const { templates } = get();
        const existingDefault = templates.find((t) => t.id === "default");
        const others = templates.filter((t) => t.id !== "default");
        
        if (existingDefault) {
          // Update default template if questions have changed
          if (JSON.stringify(existingDefault.questions) !== JSON.stringify(defaultAgentQuestions.questions)) {
            const updatedTemplates = others.map((t) => 
              t.id === "default" ? defaultAgentQuestions : t
            );
            set({ templates: updatedTemplates });
          }
          return;
        }
        
        set({ templates: [...others, defaultAgentQuestions], activeTemplateId: "default" });
      },
    }),
    {
      name: "agent-question-storage",
    }
  )
);
