// Florida, statewide: Miami and the Gold Coast, Orlando, Tampa Bay and
// Jacksonville. One market for the whole state, so the map opens on the
// state, address search covers all of it, and each area shows its nearest
// airport (see `reach` and `areaLabels`).

import type { Market } from "./types";

export const FLORIDA: Market = {
  id: "florida",
  city: "Florida",
  state: "Florida",
  stateCode: "FL",
  label: "Florida",
  areaCode: "305",
  timeZone: "America/New_York",
  geo: { lat: 27.9944, lng: -81.7603 },
  reach: {
    bounds: { south: 24.4, west: -87.7, north: 31.1, east: -79.9 },
    zoom: 7,
  },
  areaLabels: { airport: "Nearest airport", center: "From the airport" },
  region: "Florida",
  center: "Miami",

  images: {
    hero: {
      src: "/markets/florida/hero.jpg",
      alt: "The Miami skyline over the water at dusk",
    },
    // Until Florida has its own city and airport photos, these are photos
    // that could be anywhere warm.
    city: {
      src: "/images/other/aboutHeroiii.png",
      alt: "Black SUV waiting at a hotel entrance",
    },
    airport: {
      src: "/img6.jpg",
      alt: "Chauffeur waiting beside a black car",
    },
    closing: {
      src: "/markets/florida/hero.jpg",
      alt: "Miami at dusk",
    },
  },

  airports: [
    {
      code: "MIA",
      name: "Miami International Airport",
      shortName: "Miami International",
      kind: "commercial",
      meta: ["Every concourse", "About 20 min to South Beach"],
      copy: "Florida's busiest international airport and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
      address: "2100 NW 42nd Ave, Miami, FL 33142",
      lat: 25.7959,
      lng: -80.287,
    },
    {
      code: "FLL",
      name: "Fort Lauderdale–Hollywood International Airport",
      shortName: "Fort Lauderdale",
      kind: "commercial",
      meta: ["Terminals 1 to 4", "About 15 min to the beach"],
      copy: "The easy way into Fort Lauderdale and Port Everglades, with the same flight tracking and meet & greet.",
      address: "100 Terminal Dr, Fort Lauderdale, FL 33315",
      lat: 26.0742,
      lng: -80.1506,
    },
    {
      code: "PBI",
      name: "Palm Beach International Airport",
      shortName: "Palm Beach",
      kind: "commercial",
      meta: ["One terminal", "About 10 min to Palm Beach"],
      copy: "Minutes from Palm Beach and West Palm, without the Miami crowds.",
      address: "1000 James L Turnage Blvd, West Palm Beach, FL 33415",
      lat: 26.6832,
      lng: -80.0956,
    },
    {
      code: "MCO",
      name: "Orlando International Airport",
      shortName: "Orlando",
      kind: "commercial",
      meta: ["Terminals A, B and C", "About 25 min to the parks"],
      copy: "Central Florida's main airport: the parks, the convention center and the cruise run to Port Canaveral.",
      address: "1 Jeff Fuqua Blvd, Orlando, FL 32827",
      lat: 28.4312,
      lng: -81.3081,
    },
    {
      code: "TPA",
      name: "Tampa International Airport",
      shortName: "Tampa",
      kind: "commercial",
      meta: ["Airsides A to F", "About 15 min to Downtown Tampa"],
      copy: "The Gulf coast's main airport, close to Downtown Tampa, St. Pete and Clearwater.",
      address: "4100 George J Bean Pkwy, Tampa, FL 33607",
      lat: 27.9755,
      lng: -82.5332,
    },
    {
      code: "JAX",
      name: "Jacksonville International Airport",
      shortName: "Jacksonville",
      kind: "commercial",
      meta: ["One terminal", "About 20 min to Downtown"],
      copy: "North Florida's airport, for Jacksonville, the beaches and St. Augustine.",
      address: "2400 Yankee Clipper Dr, Jacksonville, FL 32218",
      lat: 30.4941,
      lng: -81.6879,
    },
    {
      code: "OPF",
      name: "Miami-Opa Locka Executive Airport",
      shortName: "Opa-locka",
      kind: "private",
      meta: ["Private aviation", "About 25 min to Miami Beach"],
      copy: "Private and charter flights into Miami, without the MIA crowds. We meet the aircraft at the FBO, not a curb.",
      address: "14201 NW 42nd Ave, Opa-locka, FL 33054",
      lat: 25.907,
      lng: -80.2784,
    },
  ],

  places: [
    {
      name: "Fontainebleau Miami Beach",
      address: "4441 Collins Ave, Miami Beach, FL 33140",
      lat: 25.8187,
      lng: -80.1223,
    },
    {
      name: "Four Seasons Hotel Miami",
      address: "1435 Brickell Ave, Miami, FL 33131",
      lat: 25.759,
      lng: -80.1922,
    },
    {
      name: "Miami Beach Convention Center",
      address: "1901 Convention Center Dr, Miami Beach, FL 33139",
      lat: 25.7953,
      lng: -80.134,
    },
  ],

  // Statewide: each area's nearest airport and the drive from it.
  areas: [
    {
      name: "Miami Beach",
      copy: "South Beach, the Fontainebleau and the convention center.",
      fromAirport: "MIA",
      fromCenter: "20 min",
      tag: "Most booked",
    },
    {
      name: "Brickell & Downtown Miami",
      copy: "The towers, Kaseya Center and PortMiami.",
      fromAirport: "MIA",
      fromCenter: "15 min",
    },
    {
      name: "Fort Lauderdale",
      copy: "Las Olas, the beach hotels and Port Everglades.",
      fromAirport: "FLL",
      fromCenter: "15 min",
    },
    {
      name: "Palm Beach",
      copy: "Worth Avenue, The Breakers and West Palm.",
      fromAirport: "PBI",
      fromCenter: "10 min",
    },
    {
      name: "Orlando",
      copy: "The parks, the Orange County Convention Center and Winter Park.",
      fromAirport: "MCO",
      fromCenter: "25 min",
    },
    {
      name: "Tampa & St. Pete",
      copy: "Downtown Tampa, Raymond James Stadium and the St. Pete beaches.",
      fromAirport: "TPA",
      fromCenter: "20 min",
    },
    {
      name: "Jacksonville",
      copy: "Downtown, the beaches and EverBank Stadium.",
      fromAirport: "JAX",
      fromCenter: "20 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Florida"],
      subhead:
        "Black car service across Florida, from Miami, Orlando and Tampa's airports to South Beach, Palm Beach, the parks and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving all of Florida",
    airportHeading: "Landing in Florida? Your chauffeur's already there.",
    terminals: {
      label: "Every major Florida airport",
      meta: "MIA, FLL, PBI, MCO, TPA and JAX",
      value: "6 airports",
    },
    privateAviation: "MIA and Opa-locka",
    airportCaption: "Miami International · MIA",
    servicesHeading: "One call for every ride in Florida",
    services: {
      airportPhrase: "MIA, MCO and TPA",
      airportDesc:
        "Miami, Fort Lauderdale, Palm Beach, Orlando, Tampa and Jacksonville, with flight tracking and meet & greet.",
      airportList:
        "Miami (MIA), Fort Lauderdale (FLL), Palm Beach (PBI), Orlando (MCO), Tampa (TPA), Jacksonville (JAX) and Opa-locka (OPF).",
      conventions:
        "Shuttles between hotels and the convention centers in Miami Beach and Orlando.",
      conventionNote:
        "Art Basel week, spring break and the big Orlando conventions sell out first. Reserve cars early.",
      weddingStops: "The beach at sunset, Vizcaya or the waterfront.",
      weddingNote:
        "Getting married on the beach? We'll time the cars to the sunset.",
      eventsDesc:
        "Hard Rock Stadium, Kaseya Center, the Kia Center and Raymond James Stadium, dropped at the door and picked up after.",
      venues:
        "Hard Rock Stadium, Kaseya Center, the Kia Center and Raymond James Stadium.",
      eventsNote:
        "Big game or concert night? Book as soon as you have tickets.",
    },
    chauffeursKnow:
      "the hotel entrances, the cruise terminals and everywhere else",
    planAround: "I-95 traffic, game-day crowds and summer storms",
    noSurgeAfter: "the game, the concert or the cruise",
    bookEarlyFor: "Art Basel, spring break and holidays",
    aboutDrive: "Florida's cities, its airports and the coast between them",
    licensed: "Licensed and permitted in Florida",
    license: {
      tag: "Florida",
      line: "Permitted to carry passengers for hire where we drive, with the county, city and airport permits and the insurance Florida requires.",
      chauffeurs:
        "Background-checked before their first ride, and checked again on a set schedule.",
      intro:
        "In Florida, a company that drives you for hire needs the right county, city and airport permits, and commercial insurance. Plenty of drivers on social media don't have them. We do, and here's what that means for you.",
      ask: "its permits and proof of insurance",
    },
    pages: {
      terminalsTag: "Every major airport",
      freeways: "I-95 and I-4",
      airportPickups:
        "Pickups at Miami, Fort Lauderdale, Palm Beach, Orlando, Tampa, Jacksonville and Opa-locka",
      hourlyStops: "three stops on Ocean Drive",
      showAndDinner: "dinner and a show in Miami Beach",
      corporateIntro:
        "Florida fills up for conventions, Art Basel and spring break, and those weeks are when cars run out first.",
      conventionCenter: "the Miami Beach Convention Center",
      bigWeek: "Art Basel week",
      weddingIntro:
        "From getting ready to the ceremony, the ceremony to the reception, and the photos on the way. Your car runs on your schedule, not the meter.",
      weddingSpots:
        "the venues and the photo spots, from the beach at sunset to Vizcaya and the waterfront",
      weddingPhotoStops: "the beach at sunset, Vizcaya or the waterfront",
      weddingWho:
        "Couples marrying in Florida, wedding planners and venues arranging transport for their couples.",
      weddingCardSub: "Ceremony to reception",
      eventVenues: [
        "Hard Rock Stadium",
        "Kaseya Center",
        "the Kia Center",
        "Raymond James Stadium",
      ],
      eventsIntro:
        "Hard Rock Stadium, Kaseya Center, the Kia Center, Raymond James Stadium and the clubs in South Beach.",
      bigNight: "a game night at Hard Rock Stadium",
      eventsWho: "game nights, Art Basel and spring break",
      eventsBestFor: "Concerts, games, the clubs",
      p2pExample: "Brickell to South Beach",
      p2pCardMore:
        "Hotel to restaurant, home to the cruise port, or across the state from Orlando to Tampa.",
      dayTripsIntro:
        "The Keys, Palm Beach, Kennedy Space Center, Naples or St. Augustine.",
      dayTripsBest:
        "The Keys, the Space Coast and the Gulf beaches are a drive away",
      dayTripsTimes:
        "From Miami, Key Largo and Palm Beach are about an hour and a quarter away and Key West about three and a half. From Orlando, Kennedy Space Center is about an hour and Tampa about an hour and a half each way.",
      dayTripsPick: "The Keys, Palm Beach, Kennedy Space Center",
      dayTripsTitle: "The Keys, the Space Coast & More",
      dayTripsCardSub: "Key Largo to Key West",
      dayTripStat: { place: "Key West", time: "3½ hrs" },
      scenery: "the coast",
      hotelsWhere: "in South Beach or Brickell",
      photos: {
        airport: {
          src: "/img6.jpg",
          alt: "Chauffeur standing beside a black car",
        },
        events: {
          src: "/markets/florida/hero.jpg",
          alt: "The Miami skyline at dusk",
        },
        eventsGallery: {
          src: "/vehicles/partyBus.jpg",
          alt: "Party bus cabin lit up for a night out",
        },
        p2p: {
          src: "/vehicles/heroiii.jpg",
          alt: "Black SUV on an open road",
        },
        weddings: [
          {
            src: "/images/other/aboutHero.jpg",
            alt: "Chauffeur stepping out of a black SUV",
          },
          {
            src: "/vehicles/limo.jpg",
            alt: "Black SUV parked under palm trees",
          },
        ],
      },
    },
    reviewTrip: "Night out in South Beach",
    fleet: {
      suvRide: "long drives down to the Keys",
      limo: "The classic South Beach arrival.",
      climate: "the Florida heat",
      heat: "the August humidity",
      dayTripKind: "day trips down the coast",
      dayTrips: "the Keys and Palm Beach",
      dayTripsLong: "Key Largo, Key West and Palm Beach",
      nightOut: "A night in South Beach",
      nightDrive: "the slow drive down Ocean Drive after dark",
      limoDrive: "a drive down Ocean Drive",
      teamTrips: "down to the Keys",
    },
    roadAlt: "Black SUV on a Florida highway",
    closingHeading: "Your go to ride in Florida",
    areas: {
      heading: "All of Florida → and the road trips along it",
      intro:
        "Miami Beach, Brickell, Fort Lauderdale, Palm Beach, Orlando, Tampa and Jacksonville, plus day trips to the Keys, the Space Coast and the Gulf beaches.",
    },
    getaway: {
      eyebrow: "Beyond the city",
      heading: "The coast starts where the city ends",
      lead: "The Keys, the Gulf beaches and the Space Coast, all within a drive of your hotel.",
      trips: [
        { name: "Key Largo", time: "1¼ hr" },
        { name: "Palm Beach", time: "1¼ hr" },
        { name: "Key West", time: "3½ hr" },
      ],
    },
    roadTrips: [
      { name: "Key West", copy: "About 3½ hours each way from Miami" },
      {
        name: "Kennedy Space Center",
        copy: "About 1 hour each way from Orlando",
      },
      { name: "Naples", copy: "About 2 hours each way from Miami" },
      { name: "St. Augustine", copy: "About 1¾ hours each way from Orlando" },
    ],
  },
};
