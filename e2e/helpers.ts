import type { Page } from "@playwright/test";

export function seedLocalStorage(page: Page) {
  return page.evaluate(() => {
    const now = Date.now();
    const DAY = 86400000;

    const ids = {
      l1: "seed-listing-1",
      l2: "seed-listing-2",
      l3: "seed-listing-3",
      l4: "seed-listing-4",
      l5: "seed-listing-5",
      l6: "seed-listing-6",
      l7: "seed-listing-7",
      l8: "seed-listing-8",
      v1: "seed-viewing-1",
      v2: "seed-viewing-2",
      v3: "seed-viewing-3",
      v4: "seed-viewing-4",
      v5: "seed-viewing-5",
      v6: "seed-viewing-6",
      v7: "seed-viewing-7",
      e1: "seed-eval-1",
      e2: "seed-eval-2",
      vd1: "seed-verdict-1",
      vd2: "seed-verdict-2",
      a1: "seed-anchor-1",
      a2: "seed-anchor-2",
      a3: "seed-anchor-3",
    };

    const daysAgo = (n: number) =>
      new Date(now - n * DAY).toISOString();
    const daysFromNow = (n: number) =>
      new Date(now + n * DAY).toISOString();

    const listings = [
      {
        id: ids.l1,
        source_url: "https://www.propertyguru.com.sg/listing/123",
        source_platform: "PropertyGuru",
        title: "Spacious Master Bedroom @ Novena MRT",
        price: 1800,
        area: "Novena / Toa Payoh",
        status: "to_view",
        notes: "Near MRT, aircon included, owner staying in",
        lat: 1.3201,
        lng: 103.8437,
        created_at: daysAgo(5),
      },
      {
        id: ids.l2,
        source_url: "https://www.propertyguru.com.sg/listing/456",
        source_platform: "PropertyGuru",
        title: "Common Room in HDB @ Tampines",
        price: 900,
        area: "Tampines",
        status: "new",
        notes: "",
        lat: 1.3496,
        lng: 103.9455,
        created_at: daysAgo(2),
      },
      {
        id: ids.l3,
        source_url: "https://www.99.co/singapore/rent/789",
        source_platform: "99.co",
        title: "Studio @ Robertson Quay",
        price: 2800,
        area: "Robertson Quay / River Valley",
        status: "viewed",
        notes:
          "Beautiful river view, great amenities, but noisy at night",
        lat: 1.2913,
        lng: 103.8412,
        created_at: daysAgo(14),
      },
      {
        id: ids.l4,
        source_url: "https://www.propertyguru.com.sg/listing/101",
        source_platform: "PropertyGuru",
        title: "Master Room @ Holland Village",
        price: 2200,
        area: "Holland Village / Buona Vista",
        status: "shortlisted",
        notes:
          "Top choice \u2014 near work, great neighborhood, good layout",
        lat: 1.3117,
        lng: 103.7961,
        created_at: daysAgo(10),
      },
      {
        id: ids.l5,
        source_url: "https://www.carousell.sg/p/rental-room-999",
        source_platform: "Carousell",
        title: "Common Room @ Clementi",
        price: 750,
        area: "Clementi / West Coast",
        status: "archived",
        notes: "Too far from MRT, decided not to pursue",
        lat: 1.3151,
        lng: 103.7655,
        created_at: daysAgo(20),
      },
      {
        id: ids.l6,
        source_url: "https://www.propertyguru.com.sg/listing/202",
        source_platform: "PropertyGuru",
        title: "Master Bedroom @ Bugis",
        price: 2500,
        area: "Bugis / Rochor",
        status: "new",
        notes: "",
        lat: 1.3008,
        lng: 103.8569,
        created_at: daysAgo(1),
      },
      {
        id: ids.l7,
        source_url: "https://www.99.co/singapore/rent/303",
        source_platform: "99.co",
        title: "Common Room @ Katong",
        price: 1100,
        area: "Katong / Joo Chiat",
        status: "to_view",
        notes: "Great food area, older unit but well maintained",
        lat: 1.3067,
        lng: 103.9022,
        created_at: daysAgo(1),
      },
      {
        id: ids.l8,
        source_url: "https://www.propertyguru.com.sg/listing/404",
        source_platform: "PropertyGuru",
        title: "HDB Common Room @ Bedok",
        price: 800,
        area: "Bedok / Upper East Coast",
        status: "viewed",
        notes: "",
        lat: 1.3236,
        lng: 103.9273,
        created_at: daysAgo(3),
      },
    ];

    const viewings = [
      {
        id: ids.v1,
        listing_id: ids.l1,
        scheduled_date: daysFromNow(1) + "T18:00:00.000Z",
        created_at: daysAgo(3),
      },
      {
        id: ids.v2,
        listing_id: ids.l3,
        scheduled_date: daysAgo(10) + "T17:30:00.000Z",
        created_at: daysAgo(12),
      },
      {
        id: ids.v3,
        listing_id: ids.l4,
        scheduled_date: daysAgo(8) + "T19:00:00.000Z",
        created_at: daysAgo(10),
      },
      {
        id: ids.v4,
        listing_id: ids.l5,
        scheduled_date: new Date(0).toISOString(),
        created_at: new Date(0).toISOString(),
      },
      {
        id: ids.v5,
        listing_id: ids.l6,
        scheduled_date: daysAgo(3) + "T14:00:00.000Z",
        created_at: daysAgo(5),
      },
      {
        id: ids.v6,
        listing_id: ids.l7,
        scheduled_date: daysFromNow(3) + "T10:30:00.000Z",
        created_at: daysAgo(1),
      },
      {
        id: ids.v7,
        listing_id: ids.l8,
        scheduled_date: new Date(864e13).toISOString(),
        created_at: daysAgo(3),
      },
    ];

    const evaluations = [
      {
        id: ids.e1,
        listing_id: ids.l3,
        template_id: "default",
        responses: {
          c1: "Not included",
          c2: 200,
          c3: "Yes",
          c4: 100,
          c5: "Yes",
          c6: "Good coverage, 1Gbps plan",
          c7: "Yes",
          c8: "Window",
          c9: "Queen",
          c10: "Real wall",
          c11: "Yes",
          c12: "OK",
          c13: "Flexible, immediate move-in",
          c14: "Yes",
          c15: 0,
          c16: "Yes",
          c17: "Yes",
          c18: "Centralized chute",
          c19: "Living alone (studio)",
          c20: "Yes",
          c21: "Yes",
          c22: "No specific restrictions",
          c23:
            "Nightlife noise from Robertson Quay, some traffic",
          c24: "Yes",
          c25:
            "Robertson Quay restaurants, Clarke Quay 5min",
          c26: "Cold Storage at UE Square 3min",
          c27: "Singapore River walking path",
          c28: "6 months notice, negotiable",
          c29: "10% increase expected at renewal",
          c30: "Minor damages covered by tenant up to $200",
          c31:
            "Full deposit returned within 14 days after inspection",
          c32: "No",
        },
        created_at: daysAgo(9),
        updated_at: daysAgo(9),
      },
      {
        id: ids.e2,
        listing_id: ids.l4,
        template_id: "default",
        responses: {
          c1: "Partial",
          c2: 100,
          c3: "No",
          c4: 0,
          c5: "Yes",
          c6: "Good coverage, fastest plan",
          c7: "Yes",
          c8: "Window",
          c9: "Queen",
          c10: "Real wall",
          c11: "Yes",
          c12: "OK",
          c13: "Available next month, flexible on exact date",
          c14: "Yes",
          c15: 2,
          c16: "Yes",
          c17: "Yes",
          c18: "Weekly cleaning included, general trash",
          c19:
            "Young working professional couple, very friendly",
          c20: "Yes",
          c21: "Maybe",
          c22: "Overnight visitors need advance notice",
          c23: "Quiet street, occasional traffic",
          c24: "Yes",
          c25:
            "Holland Village market & food centre 3min",
          c26: "Cold Storage at Holland V 3min",
          c27:
            "Botanic Gardens 10min walk, running paths along Bukit Timah",
          c28: "Flexible break clause with 1 month notice",
          c29: "Renewal with 5-8% increase, negotiable",
          c30: "Normal wear and tear covered by landlord",
          c31: "Deposit returned within 14 days",
          c32: "No",
        },
        created_at: daysAgo(7),
        updated_at: daysAgo(7),
      },
    ];

    const verdicts = [
      {
        id: ids.vd1,
        listing_id: ids.l3,
        status: "no",
        reasoning: "Too noisy at night, rent is high for what it is",
        score: 78,
        updated_at: daysAgo(8),
        created_at: daysAgo(8),
      },
      {
        id: ids.vd2,
        listing_id: ids.l4,
        status: "yes",
        reasoning:
          "Best option so far \u2014 great location, reasonable price, nice room",
        score: 83,
        updated_at: daysAgo(4),
        created_at: daysAgo(4),
      },
    ];

    const anchors = [
      {
        id: ids.a1,
        title: "Office",
        type: "work",
        lat: 1.2789,
        lng: 103.8513,
        address: "Marina Bay Financial Centre",
        created_at: daysAgo(30),
      },
      {
        id: ids.a2,
        title: "Gym",
        type: "other",
        lat: 1.3004,
        lng: 103.8411,
        address: "Fitness First @ Bugis",
        created_at: daysAgo(25),
      },
      {
        id: ids.a3,
        title: "Parents Home",
        type: "family",
        lat: 1.3329,
        lng: 103.9434,
        address: "Tampines Central",
        created_at: daysAgo(20),
      },
    ];

    const payload = {
      "listing-storage": {
        state: { listings },
        version: 0,
      },
      "viewing-storage": {
        state: { viewings },
        version: 0,
      },
      "evaluation-storage": {
        state: { evaluations },
        version: 0,
      },
      "verdict-storage": {
        state: { verdicts },
        version: 0,
      },
      "anchor-storage": {
        state: { anchors },
        version: 0,
      },
      "comparison-storage": {
        state: { selectedListingIds: [ids.l3, ids.l4] },
        version: 0,
      },
    };

    for (const [key, value] of Object.entries(payload)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    localStorage.setItem("seed-mode-active", "true");
  });
}
