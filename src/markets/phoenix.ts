// Phoenix and the Valley of the Sun.

import type { Market } from "./types";

export const PHOENIX: Market = {
  id: "phoenix",
  city: "Phoenix",
  state: "Arizona",
  stateCode: "AZ",
  label: "Phoenix, AZ",
  areaCode: "602",
  timeZone: "America/Phoenix",
  geo: { lat: 33.4484, lng: -112.074 },
  region: "the Valley of the Sun",
  center: "Downtown",

  images: {
    hero: {
      src: "/markets/phoenix/hero.jpg",
      alt: "Downtown Phoenix at sunset, with the mountains behind",
    },
    // Until Phoenix has its own city and airport photos, these are
    // photos that could be anywhere warm.
    city: {
      src: "/images/other/aboutHeroiii.png",
      alt: "Black SUV waiting at a resort entrance",
    },
    airport: {
      src: "/img6.jpg",
      alt: "Chauffeur waiting beside a black car",
    },
    closing: {
      src: "/markets/phoenix/hero.jpg",
      alt: "Phoenix at sunset",
    },
  },

  airports: [
    {
      code: "PHX",
      name: "Phoenix Sky Harbor International Airport",
      shortName: "Sky Harbor",
      kind: "commercial",
      meta: ["Terminals 3 and 4", "10–15 min to Downtown"],
      copy: "Arizona's main airport and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
      address: "3400 E Sky Harbor Blvd, Phoenix, AZ 85034",
      lat: 33.4343,
      lng: -112.0116,
    },
    {
      code: "AZA",
      name: "Phoenix–Mesa Gateway Airport",
      shortName: "Mesa Gateway",
      kind: "commercial",
      meta: ["East Valley flights", "About 35 min to Downtown"],
      copy: "The East Valley's airport, close to Mesa, Gilbert and Queen Creek. The same flight tracking, without the Sky Harbor crowds.",
      address: "6033 S Sossaman Rd, Mesa, AZ 85212",
      lat: 33.3078,
      lng: -111.6556,
    },
    {
      code: "SDL",
      name: "Scottsdale Airport",
      shortName: "Scottsdale",
      kind: "private",
      meta: ["Private aviation", "About 25 min to Downtown"],
      copy: "The quiet way into Scottsdale for private and charter flights. We meet the aircraft at the FBO, not a curb.",
      address: "15000 N Airport Dr, Scottsdale, AZ 85260",
      lat: 33.6229,
      lng: -111.9105,
    },
    {
      code: "DVT",
      name: "Phoenix Deer Valley Airport",
      shortName: "Deer Valley",
      kind: "private",
      meta: ["Private aviation", "About 25 min to Downtown"],
      copy: "Private and charter flights on the north side of the Valley, close to North Phoenix and Anthem.",
      address: "702 W Deer Valley Rd, Phoenix, AZ 85027",
      lat: 33.6883,
      lng: -112.0826,
    },
  ],

  places: [
    {
      name: "The Phoenician",
      address: "6000 E Camelback Rd, Scottsdale, AZ 85251",
      lat: 33.5035,
      lng: -111.953,
    },
    {
      name: "Fairmont Scottsdale Princess",
      address: "7575 E Princess Dr, Scottsdale, AZ 85255",
      lat: 33.6553,
      lng: -111.9119,
    },
    {
      name: "Phoenix Convention Center",
      address: "100 N 3rd St, Phoenix, AZ 85004",
      lat: 33.4489,
      lng: -112.0697,
    },
  ],

  areas: [
    {
      name: "Downtown Phoenix",
      copy: "The convention center, Footprint Center, Chase Field and Roosevelt Row.",
      fromAirport: "10 min",
      fromCenter: "Here",
    },
    {
      name: "Scottsdale",
      copy: "Old Town, the resorts, Fashion Square and the golf courses.",
      fromAirport: "20 min",
      fromCenter: "25 min",
      tag: "Most booked",
    },
    {
      name: "Tempe",
      copy: "Arizona State, Mill Avenue and Tempe Town Lake.",
      fromAirport: "10 min",
      fromCenter: "15 min",
    },
    {
      name: "Mesa",
      copy: "Mesa Gateway Airport, spring training and the East Valley.",
      fromAirport: "20 min",
      fromCenter: "25 min",
    },
    {
      name: "Chandler",
      copy: "Downtown Chandler, the tech campuses and the resorts.",
      fromAirport: "20 min",
      fromCenter: "25 min",
    },
    {
      name: "Paradise Valley",
      copy: "Camelback Mountain and the quietest resorts in the Valley.",
      fromAirport: "20 min",
      fromCenter: "20 min",
    },
    {
      name: "Glendale",
      copy: "State Farm Stadium, Desert Diamond Arena and Westgate.",
      fromAirport: "25 min",
      fromCenter: "20 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Phoenix"],
      subhead:
        "Black car service in Phoenix, from Sky Harbor International to Scottsdale, Tempe, Mesa and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving the Valley of the Sun",
    airportHeading: "Landing at Sky Harbor? Your chauffeur's already there.",
    terminals: {
      label: "Terminal 3 and Terminal 4",
      meta: "Both terminals",
      value: "T3 · T4",
    },
    privateAviation: "PHX and Scottsdale",
    airportCaption: "Phoenix Sky Harbor International · PHX",
    servicesHeading: "One call for every ride in Phoenix",
    services: {
      airportPhrase: "PHX, AZA and SDL",
      airportDesc:
        "Sky Harbor, Mesa Gateway and Scottsdale Airport, with flight tracking and meet & greet.",
      airportList: "Sky Harbor (PHX), Mesa Gateway (AZA) and Scottsdale (SDL).",
      conventions:
        "Shuttles between hotels, resorts and the Phoenix Convention Center.",
      conventionNote:
        "Phoenix Open week and spring training sell out first. Reserve cars early.",
      weddingStops:
        "The Desert Botanical Garden, Camelback Mountain or the desert at golden hour.",
      weddingNote:
        "Desert weddings run on the sunset. We'll time the cars to golden hour.",
      eventsDesc:
        "State Farm Stadium, Footprint Center, Chase Field and Old Town Scottsdale, dropped at the door and picked up after.",
      venues:
        "State Farm Stadium, Footprint Center, Chase Field and Old Town Scottsdale's clubs.",
      eventsNote:
        "Big game or concert weekend? Book as soon as you have tickets.",
    },
    chauffeursKnow:
      "the resort entrances, the stadium lots and everywhere else",
    planAround: "Valley rush hour, Phoenix Open crowds and road closures",
    noSurgeAfter: "the game, the concert or the tournament",
    bookEarlyFor: "the Phoenix Open, spring training and holidays",
    aboutDrive: "the Valley, its airports and the desert beyond them",
    licensed: "Licensed and insured in Arizona",
    license: {
      tag: "Arizona",
      line: "Licensed to carry passengers for hire in Arizona, with the registration and insurance the state requires.",
      chauffeurs:
        "Background-checked and drug-tested before their first ride, and checked again on a set schedule.",
      intro:
        "In Arizona, a company that drives you for hire has to meet the state's rules for licensing, insurance and vehicles. Plenty of drivers on social media don't. We do, and here's what that means for you.",
      ask: "proof of its license and insurance",
    },
    pages: {
      terminalsTag: "Terminals 3 and 4",
      freeways: "I-10 and the 202",
      airportPickups:
        "Pickups at Terminals 3 and 4, Mesa Gateway, Scottsdale and Deer Valley airports",
      hourlyStops: "three stops in Old Town Scottsdale",
      showAndDinner: "dinner and a show in Scottsdale",
      corporateIntro:
        "Phoenix fills up for conferences, spring training and the Phoenix Open, and those weeks are when cars run out first.",
      conventionCenter: "the Phoenix Convention Center",
      bigWeek: "Phoenix Open week",
      weddingIntro:
        "From getting ready to the ceremony, the ceremony to the reception, and the photos on the way. Your car runs on your schedule, not the meter.",
      weddingSpots:
        "the resorts and the photo spots, from the Desert Botanical Garden to Camelback Mountain and the desert at golden hour",
      weddingPhotoStops:
        "the Desert Botanical Garden, Camelback Mountain or the desert at golden hour",
      weddingWho:
        "Couples marrying in Phoenix and Scottsdale, wedding planners and resorts arranging transport for their couples.",
      weddingCardSub: "Ceremony to reception",
      eventVenues: ["State Farm Stadium", "Footprint Center", "Chase Field"],
      eventsIntro:
        "State Farm Stadium, Footprint Center, Chase Field and the clubs in Old Town Scottsdale.",
      bigNight: "a game night",
      eventsWho: "spring training and Phoenix Open week",
      eventsBestFor: "Concerts, games, the clubs",
      p2pExample: "Scottsdale to Downtown",
      p2pCardMore:
        "Hotel to restaurant, home to Old Town, or across the Valley to Tempe or Chandler.",
      dayTripsIntro:
        "Sedona, the Grand Canyon, Tucson, Prescott or an afternoon at Saguaro Lake.",
      dayTripsBest:
        "Red rock country and the high desert are a couple of hours from the Valley",
      dayTripsTimes:
        "Saguaro Lake is about 45 minutes away, Prescott and Tucson about an hour and three quarters, Sedona about two and the Grand Canyon's South Rim about three and a half each way.",
      dayTripsPick: "Sedona, the Grand Canyon, Tucson",
      dayTripsTitle: "Sedona, the Grand Canyon & More",
      dayTripsCardSub: "Sedona to the Grand Canyon",
      dayTripStat: { place: "Sedona", time: "2 hrs" },
      scenery: "the desert",
      hotelsWhere: "in Scottsdale or Downtown",
      photos: {
        airport: {
          src: "/img6.jpg",
          alt: "Chauffeur standing beside a black car",
        },
        events: {
          src: "/markets/phoenix/hero.jpg",
          alt: "Phoenix at sunset, with the mountains behind",
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
    reviewTrip: "Night in Old Town Scottsdale",
    fleet: {
      suvRide: "long desert drives",
      limo: "The classic Scottsdale arrival.",
      climate: "the Arizona heat",
      heat: "the July heat",
      dayTripKind: "desert day trips",
      dayTrips: "Sedona and Saguaro Lake",
      dayTripsLong: "Sedona, Saguaro Lake and Cave Creek",
      nightOut: "A night in Old Town Scottsdale",
      nightDrive: "the slow drive through Old Town Scottsdale after dark",
      limoDrive: "a drive through Old Town Scottsdale",
      teamTrips: "out to the desert",
    },
    roadAlt: "Black SUV on a desert highway outside Phoenix",
    closingHeading: "Your go to ride in Phoenix",
    areas: {
      heading: "All of the Valley → and the road trips beyond it",
      intro:
        "Downtown Phoenix, Scottsdale, Tempe, Mesa, Chandler, Paradise Valley and Glendale, plus day trips to Sedona, the Grand Canyon, Tucson and Prescott.",
    },
    getaway: {
      eyebrow: "Beyond the Valley",
      heading: "The desert starts where the city ends",
      lead: "Saguaros, red rock and open road, all within a drive of your resort.",
      trips: [
        { name: "Cave Creek", time: "40 min" },
        { name: "Saguaro Lake", time: "45 min" },
        { name: "Sedona", time: "2 hr" },
      ],
    },
    roadTrips: [
      { name: "Sedona", copy: "About 2 hours each way" },
      { name: "Grand Canyon South Rim", copy: "About 3½ hours each way" },
      { name: "Tucson", copy: "About 1¾ hours each way" },
      { name: "Prescott", copy: "About 1¾ hours each way" },
    ],
  },
};
