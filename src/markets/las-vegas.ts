// Las Vegas: the original. The wording is silver-state's.

import type { Market } from "./types";

export const LAS_VEGAS: Market = {
  id: "las-vegas",
  city: "Las Vegas",
  state: "Nevada",
  stateCode: "NV",
  label: "Las Vegas, NV",
  timeZone: "America/Los_Angeles",
  region: "the Las Vegas Valley",
  center: "the Strip",

  images: {
    hero: {
      src: "/markets/las-vegas/hero.jpg",
      alt: "The Las Vegas Strip from above at night",
    },
    city: {
      src: "/images/other/vegas.jpg",
      alt: "The Las Vegas Strip by day",
    },
    airport: {
      src: "/images/other/vegasAirport.jpg",
      alt: "Harry Reid International Airport at night",
    },
    closing: {
      src: "/images/other/vegasAirport.jpg",
      alt: "Las Vegas freeway at night",
    },
  },

  airports: [
    {
      code: "LAS",
      name: "Harry Reid International Airport",
      shortName: "Harry Reid",
      kind: "commercial",
      meta: ["Terminals 1 and 3", "10–20 min to the Strip"],
      copy: "Nevada's main airport and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
    },
    {
      code: "HND",
      name: "Henderson Executive Airport",
      shortName: "Henderson Executive",
      kind: "private",
      meta: ["Private aviation", "About 20 min to the Strip"],
      copy: "The quiet way into Las Vegas for private and charter flights. We meet the aircraft at the FBO, not a curb.",
    },
    {
      code: "VGT",
      name: "North Las Vegas Airport",
      shortName: "North Las Vegas",
      kind: "private",
      meta: ["Private aviation", "About 20 min to the Strip"],
      copy: "Private, charter and scenic flights on the north side of the valley, close to Summerlin and Downtown.",
    },
    {
      code: "BLD",
      name: "Boulder City Municipal Airport",
      shortName: "Boulder City",
      kind: "tours",
      meta: ["Grand Canyon air tours", "About 35 min to the Strip"],
      copy: "Home of the Grand Canyon and Hoover Dam air tours. We drop you for the early departure and pick you up when you land.",
    },
  ],

  areas: [
    {
      name: "The Strip",
      copy: "Resorts, casinos, the Convention Center and the Sphere.",
      fromAirport: "10 min",
      fromCenter: "Here",
      tag: "Most booked",
    },
    {
      name: "Downtown",
      copy: "Fremont Street, the Arts District and the courthouse.",
      fromAirport: "15 min",
      fromCenter: "10 min",
    },
    {
      name: "Henderson",
      copy: "Green Valley, the M Resort and Henderson Executive Airport.",
      fromAirport: "15 min",
      fromCenter: "20 min",
    },
    {
      name: "Summerlin",
      copy: "Red Rock Casino, Downtown Summerlin and the golf courses.",
      fromAirport: "25 min",
      fromCenter: "20 min",
    },
    {
      name: "North Las Vegas",
      copy: "Nellis, Aliante and North Las Vegas Airport.",
      fromAirport: "20 min",
      fromCenter: "20 min",
    },
    {
      name: "Boulder City",
      copy: "The old town, and the last stop before Hoover Dam.",
      fromAirport: "30 min",
      fromCenter: "35 min",
    },
    {
      name: "Lake Las Vegas",
      copy: "Lakeside resorts, the marina and the golf.",
      fromAirport: "30 min",
      fromCenter: "30 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Las Vegas"],
      subhead:
        "Black car service in Las Vegas, from Harry Reid International to the Strip, Henderson, Summerlin and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving the Las Vegas Valley",
    airportHeading: "Landing at Harry Reid? Your chauffeur's already there.",
    terminals: {
      label: "Terminal 1 and Terminal 3",
      meta: "Both terminals",
      value: "T1 · T3",
    },
    privateAviation: "LAS and Henderson",
    airportCaption: "Harry Reid International · LAS",
    servicesHeading: "One call for every ride in Las Vegas",
    services: {
      airportPhrase: "LAS, HND and VGT",
      airportDesc:
        "Harry Reid International, Henderson Executive and North Las Vegas, with flight tracking and meet & greet.",
      airportList:
        "Harry Reid (LAS), Henderson Executive (HND) and North Las Vegas (VGT).",
      conventions: "Shuttles between hotels and the convention center.",
      conventionNote:
        "Convention weeks sell out first. Reserve cars for CES and the big shows early.",
      weddingStops: "The Welcome to Las Vegas sign, Downtown or the desert.",
      weddingNote:
        "Marrying in Las Vegas? We can stop at the Marriage License Bureau downtown first.",
      eventsDesc:
        "Allegiant Stadium, T-Mobile Arena, Sphere and the clubs, dropped at the door and picked up after.",
      venues:
        "Allegiant Stadium, T-Mobile Arena, Sphere and the Strip's clubs.",
      eventsNote:
        "Big fight or concert weekend? Book as soon as you have tickets.",
    },
    chauffeursKnow:
      "the casino porte-cocheres, the convention halls and everywhere else",
    planAround: "Strip traffic, convention crowds and road closures",
    noSurgeAfter: "the fight, the concert or the game",
    bookEarlyFor: "conventions, fight weekends and holidays",
    aboutDrive: "the Strip, the airports and the desert beyond them",
    licensed: "Licensed by the Nevada Transportation Authority",
    reviewTrip: "Night on the Strip",
    fleet: {
      suvRide: "long desert drives",
      limo: "The classic Las Vegas arrival.",
      climate: "the desert",
    },
    roadAlt: "Black SUV on a desert highway outside Las Vegas",
    closingHeading: "Your go to ride in Las Vegas",
    areas: {
      heading: "All of the Las Vegas Valley → and the road trips beyond it",
      intro:
        "The Strip, Downtown, Henderson, Summerlin, North Las Vegas, Boulder City and Lake Las Vegas, plus day trips to Hoover Dam, the Grand Canyon West Rim, Zion and Death Valley.",
    },
    getaway: {
      eyebrow: "Beyond the Strip",
      heading: "The desert starts where the city ends",
      lead: "Red rock, open road and a sky that goes on forever, all within an hour of your hotel.",
      trips: [
        { name: "Red Rock Canyon", time: "30 min" },
        { name: "Hoover Dam", time: "45 min" },
        { name: "Valley of Fire", time: "1 hr" },
      ],
    },
    roadTrips: [
      { name: "Hoover Dam", copy: "About 45 minutes each way" },
      { name: "Grand Canyon West Rim", copy: "About 2½ hours each way" },
      { name: "Zion National Park", copy: "About 2½ hours each way" },
      { name: "Death Valley", copy: "About 2 hours each way" },
    ],
  },
};
