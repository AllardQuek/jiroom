import { AgentQuestionTemplate } from "@/types/agentQuestion";

export const defaultAgentQuestions: AgentQuestionTemplate = {
  id: "default",
  name: "Default Agent Questions",
  questions: [
    "Visitors: ",
    "Aircon/Utilities limitations: ",
    "Windows (external/internal facing): ",
    "Current tenant profiles: ",
    "Dryer included: ",
  ],
  updated_at: new Date().toISOString(),
};
