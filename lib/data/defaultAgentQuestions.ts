import { AgentQuestionTemplate } from "@/types/agentQuestion";

export const defaultAgentQuestions: AgentQuestionTemplate = {
  id: "default",
  name: "Default Agent Questions",
  questions: [
    "Visitors: ",
    "Dryer included: ",
    "Aircon usage limitations: ",
    "Windows (external vs internal facing): ",
    "Current tenant profiles: ",
    "Move-in date flexibility: ",
    "Lease duration/terms: ",
    "Cooking allowed: ",
    "Pets allowed: ",
    "WiFi included: ",
    "Washer available: ",
    "Break/transfer clause: ",
    "Renewal terms & rent increase: ",
  ],
  updated_at: new Date().toISOString(),
};
