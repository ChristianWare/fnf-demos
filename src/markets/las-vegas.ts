// Las Vegas: the original. The wording is silver-state's.

import type { Market } from "./types";

export const LAS_VEGAS: Market = {
  id: "las-vegas",
  city: "Las Vegas",
  state: "Nevada",
  stateCode: "NV",
  label: "Las Vegas, NV",
  areaCode: "702",
  timeZone: "America/Los_Angeles",
  geo: { lat: 36.1147, lng: -115.1728 },
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
      address: "5757 Wayne Newton Blvd, Las Vegas, NV 89119",
      lat: 36.084,
      lng: -115.1537,
    },
    {
      code: "HND",
      name: "Henderson Executive Airport",
      shortName: "Henderson Executive",
      kind: "private",
      meta: ["Private aviation", "About 20 min to the Strip"],
      copy: "The quiet way into Las Vegas for private and charter flights. We meet the aircraft at the FBO, not a curb.",
      address: "3500 Executive Terminal Dr, Henderson, NV 89052",
      lat: 35.9729,
      lng: -115.1344,
    },
    {
      code: "VGT",
      name: "North Las Vegas Airport",
      shortName: "North Las Vegas",
      kind: "private",
      meta: ["Private aviation", "About 20 min to the Strip"],
      copy: "Private, charter and scenic flights on the north side of the valley, close to Summerlin and Downtown.",
      address: "2730 Airport Dr, North Las Vegas, NV 89032",
      lat: 36.2106,
      lng: -115.1944,
    },
    {
      code: "BLD",
      name: "Boulder City Municipal Airport",
      shortName: "Boulder City",
      kind: "tours",
      meta: ["Grand Canyon air tours", "About 35 min to the Strip"],
      copy: "Home of the Grand Canyon and Hoover Dam air tours. We drop you for the early departure and pick you up when you land.",
      address: "1201 Airport Rd, Boulder City, NV 89005",
      lat: 35.9476,
      lng: -114.861,
    },
  ],

  places: [
    {
      name: "Bellagio",
      address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
      lat: 36.1126,
      lng: -115.1767,
    },
    {
      name: "The Venetian Resort",
      address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
      lat: 36.1212,
      lng: -115.1697,
    },
    {
      name: "Las Vegas Convention Center",
      address: "3150 Paradise Rd, Las Vegas, NV 89109",
      lat: 36.1311,
      lng: -115.1522,
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
    license: {
      tag: "NTA",
      line: "Licensed by the Nevada Transportation Authority. Look us up on the NTA's website.",
      chauffeurs:
        "Licensed to drive for hire in Nevada, background-checked and drug-tested before their first ride.",
      intro:
        "In Nevada, any company that drives you for hire needs a certificate from the state. Plenty of drivers on social media don't have one. We do, and here's what that means for you.",
      ask: "its NTA certificate number",
    },
    pages: {
      terminalsTag: "Terminals 1 and 3",
      freeways: "I-15 and the 215",
      airportPickups:
        "Pickups at Terminal 1 and Terminal 3, Henderson Executive and North Las Vegas airports",
      hourlyStops: "three stops on the Strip",
      showAndDinner: "a show and dinner on the Strip",
      corporateIntro:
        "Las Vegas hosts some of the biggest trade shows in the country, and convention weeks are when cars run out first.",
      conventionCenter: "the Las Vegas Convention Center",
      bigWeek: "CES week",
      weddingIntro:
        "From the Marriage License Bureau to the chapel, the chapel to the reception, and the photos on the way. Your car runs on your schedule, not the meter.",
      weddingSpots:
        "the chapels and the photo spots, from the Welcome to Fabulous Las Vegas sign to Downtown and the desert",
      weddingPhotoStops:
        "the Welcome to Fabulous Las Vegas sign, Downtown or the desert",
      weddingWho:
        "Couples marrying in Las Vegas, wedding planners and chapels arranging transport for their couples.",
      weddingCardSub: "Chapel to reception",
      eventVenues: ["Allegiant Stadium", "T-Mobile Arena", "Sphere"],
      eventsIntro:
        "Allegiant Stadium, T-Mobile Arena, Sphere, the clubs and the fight.",
      bigNight: "a fight night",
      eventsWho: "Formula 1 weekend and NFR week",
      eventsBestFor: "Concerts, fights, games, the clubs",
      p2pExample: "the Strip to Downtown",
      p2pCardMore:
        "Hotel to restaurant, home to the Strip, or across the valley to Henderson or Summerlin.",
      dayTripsIntro:
        "Hoover Dam, the Grand Canyon West Rim, Zion, Death Valley, Valley of Fire or a ride home to St. George.",
      dayTripsBest: "The best of the desert is an hour or two from the Strip",
      dayTripsTimes:
        "Hoover Dam is about 45 minutes away, Valley of Fire about an hour, Death Valley about two and Zion and the Grand Canyon West Rim about two and a half each way.",
      dayTripsPick: "Hoover Dam, Zion, the Grand Canyon",
      dayTripsTitle: "Hoover Dam, Zion & More",
      dayTripsCardSub: "Hoover Dam to Zion",
      dayTripStat: { place: "Hoover Dam", time: "45 min" },
      scenery: "the desert",
      hotelsWhere: "on the Strip",
      photos: {
        airport: {
          src: "/images/other/vegasAirport.jpg",
          alt: "Freeway to Harry Reid International at night",
        },
        events: {
          src: "/markets/las-vegas/hero.jpg",
          alt: "The Las Vegas Valley lit up at night",
        },
        eventsGallery: {
          src: "/images/other/vegasAirport.jpg",
          alt: "Las Vegas freeway at night",
        },
        p2p: {
          src: "/images/other/hero.jpg",
          alt: "The Las Vegas Strip skyline at dusk",
        },
        weddings: [
          {
            src: "/images/other/heroii.jpg",
            alt: "Gondola on the canal outside a Las Vegas resort",
          },
          { src: "/images/other/vegas.jpg", alt: "The Las Vegas Strip by day" },
        ],
      },
    },
    reviewTrip: "Night on the Strip",
    fleet: {
      suvRide: "long desert drives",
      limo: "The classic Las Vegas arrival.",
      climate: "the desert",
      heat: "the July heat",
      dayTripKind: "desert day trips",
      dayTrips: "Hoover Dam and Red Rock",
      dayTripsLong: "Hoover Dam, Red Rock and Valley of Fire",
      nightOut: "A night on the Strip",
      nightDrive: "the slow drive down the Strip after dark",
      limoDrive: "a drive down the Strip",
      teamTrips: "out to the desert",
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
