// Los Angeles: the city, the Westside, the Valley and the coast.

import type { Market } from "./types";

export const LOS_ANGELES: Market = {
  id: "los-angeles",
  city: "Los Angeles",
  state: "California",
  stateCode: "CA",
  label: "Los Angeles, CA",
  areaCode: "213",
  timeZone: "America/Los_Angeles",
  geo: { lat: 34.0522, lng: -118.2437 },
  region: "greater Los Angeles",
  center: "Downtown",

  images: {
    hero: {
      src: "/markets/los-angeles/hero.jpg",
      alt: "Downtown Los Angeles from above",
    },
    // Until Los Angeles has its own city and airport photos, these are
    // photos that could be anywhere warm.
    city: {
      src: "/images/other/aboutHeroiii.png",
      alt: "Black SUV waiting at a hotel entrance",
    },
    airport: {
      src: "/img6.jpg",
      alt: "Chauffeur waiting beside a black car",
    },
    closing: {
      src: "/markets/los-angeles/hero.jpg",
      alt: "Downtown Los Angeles",
    },
  },

  airports: [
    {
      code: "LAX",
      name: "Los Angeles International Airport",
      shortName: "LAX",
      kind: "commercial",
      meta: ["Every terminal, and Tom Bradley", "About 30 min to Downtown"],
      copy: "Southern California's main airport and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
      address: "1 World Way, Los Angeles, CA 90045",
      lat: 33.9416,
      lng: -118.4085,
    },
    {
      code: "BUR",
      name: "Hollywood Burbank Airport",
      shortName: "Burbank",
      kind: "commercial",
      meta: ["Short walks, short lines", "About 20 min to Downtown"],
      copy: "The easy way into Hollywood, the Valley and Pasadena. Off the plane and on the road in minutes.",
      address: "2627 N Hollywood Way, Burbank, CA 91505",
      lat: 34.1975,
      lng: -118.3585,
    },
    {
      code: "LGB",
      name: "Long Beach Airport",
      shortName: "Long Beach",
      kind: "commercial",
      meta: ["One terminal", "About 30 min to Downtown"],
      copy: "A smaller airport for the South Bay and the Orange County line, without the LAX traffic.",
      address: "4100 Donald Douglas Dr, Long Beach, CA 90808",
      lat: 33.8177,
      lng: -118.1516,
    },
    {
      code: "VNY",
      name: "Van Nuys Airport",
      shortName: "Van Nuys",
      kind: "private",
      meta: ["Private aviation", "About 30 min to Downtown"],
      copy: "One of the busiest private jet airports in the country. We meet the aircraft at the FBO, not a curb.",
      address: "16461 Sherman Way, Van Nuys, CA 91406",
      lat: 34.2098,
      lng: -118.49,
    },
  ],

  areas: [
    {
      name: "Beverly Hills",
      copy: "Rodeo Drive, the grand hotels and Century City next door.",
      fromAirport: "25 min",
      fromCenter: "25 min",
      tag: "Most booked",
    },
    {
      name: "Santa Monica",
      copy: "The pier, the beach hotels and Venice next door.",
      fromAirport: "20 min",
      fromCenter: "30 min",
    },
    {
      name: "Hollywood",
      copy: "The Walk of Fame, the Hollywood Bowl and West Hollywood's clubs.",
      fromAirport: "30 min",
      fromCenter: "20 min",
    },
    {
      name: "Downtown",
      copy: "Crypto.com Arena, the convention center and the Arts District.",
      fromAirport: "25 min",
      fromCenter: "Here",
    },
    {
      name: "Pasadena",
      copy: "Old Pasadena, the Rose Bowl and the Huntington.",
      fromAirport: "40 min",
      fromCenter: "20 min",
    },
    {
      name: "Burbank",
      copy: "The studios and Hollywood Burbank Airport.",
      fromAirport: "40 min",
      fromCenter: "20 min",
    },
    {
      name: "Malibu",
      copy: "The coast, the canyons and the beach houses.",
      fromAirport: "45 min",
      fromCenter: "50 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Los Angeles"],
      subhead:
        "Black car service in Los Angeles, from LAX to Beverly Hills, Santa Monica, Hollywood and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving greater Los Angeles",
    airportHeading: "Landing at LAX? Your chauffeur's already there.",
    terminals: {
      label: "Every LAX terminal",
      meta: "Including Tom Bradley",
      value: "T1–T8 · B",
    },
    privateAviation: "LAX and Van Nuys",
    airportCaption: "Los Angeles International · LAX",
    servicesHeading: "One call for every ride in Los Angeles",
    services: {
      airportPhrase: "LAX, BUR and VNY",
      airportDesc:
        "LAX, Hollywood Burbank and Van Nuys, with flight tracking and meet & greet.",
      airportList:
        "LAX, Hollywood Burbank (BUR), Long Beach (LGB) and Van Nuys (VNY).",
      conventions: "Shuttles between hotels and the LA Convention Center.",
      conventionNote:
        "Award season and the big conventions sell out first. Reserve cars early.",
      weddingStops:
        "The coast in Malibu, Griffith Observatory or Downtown's old theaters.",
      weddingNote:
        "Getting married on the coast? We'll time the cars to the sunset.",
      eventsDesc:
        "SoFi Stadium, Crypto.com Arena, the Hollywood Bowl and Dodger Stadium, dropped at the door and picked up after.",
      venues:
        "SoFi Stadium, Crypto.com Arena, the Hollywood Bowl and Dodger Stadium.",
      eventsNote:
        "Big game, premiere or concert night? Book as soon as you have tickets.",
    },
    chauffeursKnow: "the hotel entrances, the studio gates and everywhere else",
    planAround: "freeway traffic, award-season crowds and road closures",
    noSurgeAfter: "the game, the concert or the premiere",
    bookEarlyFor: "award season, big game weekends and holidays",
    aboutDrive: "the city, its airports and the coast beyond them",
    licensed: "Licensed by the California Public Utilities Commission",
    license: {
      tag: "CPUC",
      line: "Permitted by the California Public Utilities Commission as a charter-party carrier (TCP). Look us up on the CPUC's website.",
      chauffeurs:
        "Background-checked and drug-tested before their first ride, as the CPUC requires.",
      intro:
        "In California, any company that drives you for hire needs a charter-party permit from the Public Utilities Commission. Plenty of drivers on social media don't have one. We do, and here's what that means for you.",
      ask: "its TCP number",
    },
    reviewTrip: "Night in Hollywood",
    fleet: {
      suvRide: "long drives up the coast",
      limo: "The classic Hollywood arrival.",
      climate: "the Southern California sun",
      heat: "the summer heat",
      dayTripKind: "day trips up the coast",
      dayTrips: "Malibu and Palm Springs",
      dayTripsLong: "Malibu, Palm Springs and Joshua Tree",
      nightOut: "A night in Hollywood",
      nightDrive: "the slow drive down Sunset Boulevard after dark",
      limoDrive: "a drive down Sunset Boulevard",
      teamTrips: "up the coast",
    },
    roadAlt: "Black SUV on an open highway outside Los Angeles",
    closingHeading: "Your go to ride in Los Angeles",
    areas: {
      heading: "All of greater Los Angeles → and the road trips beyond it",
      intro:
        "Beverly Hills, Santa Monica, Hollywood, Downtown, Pasadena, Burbank and Malibu, plus day trips to Santa Barbara, Palm Springs, San Diego and Temecula.",
    },
    getaway: {
      eyebrow: "Beyond the city",
      heading: "The open road starts where the city ends",
      lead: "The coast, the canyons and the desert, all within a drive of your hotel.",
      trips: [
        { name: "Malibu", time: "45 min" },
        { name: "Palm Springs", time: "2 hr" },
        { name: "Joshua Tree", time: "2½ hr" },
      ],
    },
    roadTrips: [
      { name: "Santa Barbara", copy: "About 2 hours each way" },
      { name: "Palm Springs", copy: "About 2 hours each way" },
      { name: "San Diego", copy: "About 2 hours each way" },
      { name: "Temecula wine country", copy: "About 1½ hours each way" },
    ],
  },
};
