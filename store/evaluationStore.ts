import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Evaluation } from "@/types/evaluation";

interface EvaluationState {
  evaluations: Evaluation[];
  addEvaluation: (evaluation: Evaluation) => void;
  updateEvaluation: (id: string, updates: Partial<Evaluation>) => void;
  deleteEvaluation: (id: string) => void;
  getEvaluation: (id: string) => Evaluation | undefined;
}

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set, get) => ({
      evaluations: [],
      addEvaluation: (evaluation) =>
        set((state) => ({ evaluations: [...state.evaluations, evaluation] })),
      updateEvaluation: (id, updates) =>
        set((state) => ({
          evaluations: state.evaluations.map((evaluation) =>
            evaluation.id === id ? { ...evaluation, ...updates } : evaluation
          ),
        })),
      deleteEvaluation: (id) =>
        set((state) => ({
          evaluations: state.evaluations.filter(
            (evaluation) => evaluation.id !== id
          ),
        })),
      getEvaluation: (id) =>
        get().evaluations.find((evaluation) => evaluation.id === id),
    }),
    {
      name: "evaluation-storage",
    }
  )
);
