import { Template } from "@/types/evaluation";

export const defaultTemplate: Template = {
  id: "default",
  name: "Default Rental Evaluation",
  version: 5,
  criteria: [
    // Cost
    {
      id: "c2",
      name: "Monthly utility cost (SGD)",
      description: "Average monthly utilities (water, electricity, gas). If included in rent, leave blank.",
      type: "number",
      category: "Cost",
    },
    {
      id: "c4",
      name: "Additional costs (SGD/mth)",
      description: "Monthly additional costs (cleaning, aircon, etc.). Leave blank if none.",
      type: "number",
      category: "Cost",
    },
    {
      id: "c0",
      name: "Total monthly cost (computed)",
      description:
        "Rent + utilities + additional costs. Below $1k is good, $1-1.2k is neutral, above $1.2k is expensive.",
      type: "derived",
      category: "Cost",
      derivedFrom: ["c2", "c4"],
      thresholds: [
        { max: 1000, score: 1 },
        { min: 1000, max: 1200, score: 0 },
        { min: 1200, score: -1 },
      ],
    },
    // Connectivity
    {
      id: "c5",
      name: "WiFi included",
      description: "Is WiFi provided in the rental?",
      type: "select",
      category: "Connectivity",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    {
      id: "c6",
      name: "WiFi coverage / quality notes",
      description: "Any notes about WiFi location, coverage, or speed.",
      type: "text",
      category: "Connectivity",
    },
    {
      id: "c7",
      name: "Mobile data coverage in room",
      description: "Is there adequate mobile data reception inside the room?",
      type: "select",
      category: "Connectivity",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    // Room
    {
      id: "c8",
      name: "Room windows",
      description: "Type of window in the room.",
      type: "select",
      category: "Room",
      options: ["Window", "Indoor window", "No window"],
      scores: { Window: 1, "Indoor window": 0, "No window": -1 },
    },
    {
      id: "c9",
      name: "Bed size",
      description: "Size of the bed provided.",
      type: "select",
      category: "Room",
      options: ["Single", "Super single", "Queen", "King"],
      scores: { Single: -1, "Super single": 0, Queen: 1, King: 1 },
    },
    {
      id: "c10",
      name: "Walls",
      description: "Are the walls real (brick/drywall) or partition?",
      type: "select",
      category: "Room",
      options: ["Real wall", "Partition"],
      scores: { "Real wall": 1, Partition: -1 },
    },
    {
      id: "c11",
      name: "Furniture included",
      description: "Is the room furnished (table, chair, bed, etc.)?",
      type: "select",
      category: "Room",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    {
      id: "c12",
      name: "Power points",
      description: "Are there sufficient and conveniently placed power points?",
      type: "select",
      category: "Room",
      options: ["OK", "Not OK", "Unsure"],
      scores: { OK: 1, "Not OK": -1, Unsure: 0 },
    },
    {
      id: "c13",
      name: "Move-in date notes",
      description:
        "Earliest move-in date, current lease expiry, possibility of early move-in.",
      type: "text",
      category: "Room",
    },
    // Bathroom
    {
      id: "c14",
      name: "Bathroom / shower quality",
      description:
        "Is the bathroom and shower in good condition (water pressure, size, cleanliness)?",
      type: "select",
      category: "Bathroom",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    {
      id: "c15",
      name: "People sharing bathroom",
      description:
        "Number of people sharing the bathroom. 1-2 is ideal, 3 is neutral, 4+ is too many.",
      type: "number",
      category: "Bathroom",
      thresholds: [
        { max: 2, score: 1 },
        { min: 3, max: 3, score: 0 },
        { min: 4, score: -1 },
      ],
    },
    // Amenities
    {
      id: "c16",
      name: "Washer available",
      description: "Is a washing machine available for use?",
      type: "select",
      category: "Amenities",
      options: ["Yes", "No"],
      scores: { Yes: 1, No: -1 },
    },
    {
      id: "c17",
      name: "Dryer available",
      description: "Is a clothes dryer available for use?",
      type: "select",
      category: "Amenities",
      options: ["Yes", "No"],
      scores: { Yes: 1, No: -1 },
    },
    {
      id: "c18",
      name: "Trash management notes",
      description: "How is trash managed? Any specific rules or schedules?",
      type: "text",
      category: "Amenities",
    },
    // Household
    {
      id: "c19",
      name: "Tenant profile notes",
      description: "Description of current housemates / tenants (occupation, lifestyle, etc.).",
      type: "text",
      category: "Household",
    },
    {
      id: "c20",
      name: "Comfortable with current tenants",
      description: "Based on the tenant profile, do you feel comfortable living with them?",
      type: "select",
      category: "Household",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    {
      id: "c21",
      name: "Visitors allowed",
      description: "Yes = anytime, overnight OK. Day only = day visitors only (e.g., until 10pm). No = no visitors.",
      type: "select",
      category: "Household",
      options: ["Yes", "Day only", "No"],
      scores: { Yes: 1, "Day only": 0, No: -1 },
    },
    {
      id: "c22",
      name: "Visitor rules notes",
      description: "Any specific rules about visitors (frequency, duration, advance notice).",
      type: "text",
      category: "Household",
    },
    // Surroundings
    {
      id: "c23",
      name: "Surrounding noises / disturbances",
      description:
        "Note any noise disturbances: ambulance, fire truck, planes, construction, common areas, etc.",
      type: "text",
      category: "Surroundings",
    },
    {
      id: "c24",
      name: "Wet weather accessibility",
      description:
        "Are there sheltered walkways to MRT/bus stops or a place to wait out rain at arrival?",
      type: "select",
      category: "Surroundings",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
    {
      id: "c25",
      name: "Nearby food options",
      description: "Nearby food centres, restaurants, or grocery stores.",
      type: "text",
      category: "Surroundings",
    },
    {
      id: "c26",
      name: "Nearby supermarket",
      description: "Nearest supermarket and approximate walking distance.",
      type: "text",
      category: "Surroundings",
    },
    {
      id: "c27",
      name: "Nearby parks / running routes",
      description:
        "Nearby parks, running paths, music school, library, CDC Ubi, or other POIs.",
      type: "text",
      category: "Surroundings",
    },
    // Additional
    {
      id: "c28",
      name: "Break / transfer clause",
      description:
        "Is there a break clause or option to transfer the lease? Under what conditions?",
      type: "text",
      category: "Additional",
    },
    {
      id: "c29",
      name: "Renewal terms & rent increase",
      description:
        "What are the renewal terms? How much is the expected rent increase upon renewal?",
      type: "text",
      category: "Additional",
    },
    {
      id: "c30",
      name: "Damage coverage",
      description: "What damages are covered by the landlord vs tenant? Any insurance requirements?",
      type: "text",
      category: "Additional",
    },
    {
      id: "c31",
      name: "Deposit return conditions",
      description:
        "Under what conditions is the deposit returned? How long does it take?",
      type: "text",
      category: "Additional",
    },
    {
      id: "c32",
      name: "Condo gates / shortcut to MRT/bus",
      description:
        "Are there condo gates or shortcuts that provide quicker access to MRT or bus stops?",
      type: "select",
      category: "Additional",
      options: ["Yes", "No", "Maybe"],
      scores: { Yes: 1, No: -1, Maybe: 0 },
    },
  ],
  updated_at: new Date().toISOString(),
};
