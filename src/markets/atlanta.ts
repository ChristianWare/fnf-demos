// Atlanta: the city, Buckhead and Midtown, the northern suburbs.

import type { Market } from "./types";

export const ATLANTA: Market = {
  id: "atlanta",
  city: "Atlanta",
  state: "Georgia",
  stateCode: "GA",
  label: "Atlanta, GA",
  areaCode: "404",
  timeZone: "America/New_York",
  geo: { lat: 33.749, lng: -84.388 },
  region: "metro Atlanta",
  center: "Downtown",

  images: {
    hero: {
      src: "/markets/atlanta/hero.jpg",
      alt: "The Atlanta skyline at dusk",
    },
    // Until Atlanta has its own city and airport photos, these are photos
    // that could be anywhere.
    city: {
      src: "/images/other/aboutHeroiii.png",
      alt: "Black SUV waiting at a hotel entrance",
    },
    airport: {
      src: "/img6.jpg",
      alt: "Chauffeur waiting beside a black car",
    },
    closing: {
      src: "/markets/atlanta/hero.jpg",
      alt: "Atlanta at dusk",
    },
  },

  airports: [
    {
      code: "ATL",
      name: "Hartsfield-Jackson Atlanta International Airport",
      shortName: "Hartsfield-Jackson",
      kind: "commercial",
      meta: [
        "Domestic and International terminals",
        "About 20 min to Downtown",
      ],
      copy: "The world's busiest airport and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
      address: "6000 N Terminal Pkwy, Atlanta, GA 30320",
      lat: 33.6407,
      lng: -84.4277,
    },
    {
      code: "PDK",
      name: "DeKalb–Peachtree Airport",
      shortName: "Peachtree-DeKalb",
      kind: "private",
      meta: ["Private aviation", "About 20 min to Buckhead"],
      copy: "Atlanta's busiest private jet airport, close to Buckhead and the northern suburbs. We meet the aircraft at the FBO, not a curb.",
      address: "2000 Airport Rd, Chamblee, GA 30341",
      lat: 33.8756,
      lng: -84.302,
    },
    {
      code: "FTY",
      name: "Fulton County Airport–Brown Field",
      shortName: "Fulton County",
      kind: "private",
      meta: ["Private aviation", "About 15 min to Downtown"],
      copy: "Private and charter flights on the west side, the quick way to Downtown and the stadiums.",
      address: "3952 Aviation Cir NW, Atlanta, GA 30336",
      lat: 33.7791,
      lng: -84.5214,
    },
  ],

  places: [
    {
      name: "The St. Regis Atlanta",
      address: "88 W Paces Ferry Rd NW, Atlanta, GA 30305",
      lat: 33.8394,
      lng: -84.3846,
    },
    {
      name: "Four Seasons Hotel Atlanta",
      address: "75 14th St NE, Atlanta, GA 30309",
      lat: 33.7867,
      lng: -84.3866,
    },
    {
      name: "Georgia World Congress Center",
      address: "285 Andrew Young International Blvd NW, Atlanta, GA 30313",
      lat: 33.7593,
      lng: -84.3965,
    },
  ],

  areas: [
    {
      name: "Buckhead",
      copy: "Lenox, Phipps Plaza and the grand hotels.",
      fromAirport: "30 min",
      fromCenter: "15 min",
      tag: "Most booked",
    },
    {
      name: "Midtown",
      copy: "The Fox Theatre, the High Museum and Piedmont Park.",
      fromAirport: "20 min",
      fromCenter: "10 min",
    },
    {
      name: "Downtown",
      copy: "Mercedes-Benz Stadium, State Farm Arena and the Georgia World Congress Center.",
      fromAirport: "15 min",
      fromCenter: "Here",
    },
    {
      name: "Alpharetta",
      copy: "Avalon and the North Fulton offices.",
      fromAirport: "40 min",
      fromCenter: "35 min",
    },
    {
      name: "Sandy Springs",
      copy: "The Perimeter offices and the Chattahoochee.",
      fromAirport: "35 min",
      fromCenter: "25 min",
    },
    {
      name: "Decatur",
      copy: "The square, Emory and the restaurants.",
      fromAirport: "25 min",
      fromCenter: "15 min",
    },
    {
      name: "The Battery Atlanta",
      copy: "Truist Park and the neighborhood around it.",
      fromAirport: "30 min",
      fromCenter: "20 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Atlanta"],
      subhead:
        "Black car service in Atlanta, from Hartsfield-Jackson to Buckhead, Midtown, Alpharetta and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving metro Atlanta",
    airportHeading:
      "Landing at Hartsfield-Jackson? Your chauffeur's already there.",
    terminals: {
      label: "Domestic and International terminals",
      meta: "Both terminals",
      value: "DOM · INTL",
    },
    privateAviation: "ATL and Peachtree-DeKalb",
    airportCaption: "Hartsfield-Jackson Atlanta International · ATL",
    servicesHeading: "One call for every ride in Atlanta",
    services: {
      airportPhrase: "ATL, PDK and FTY",
      airportDesc:
        "Hartsfield-Jackson, Peachtree-DeKalb and Fulton County, with flight tracking and meet & greet.",
      airportList:
        "Hartsfield-Jackson (ATL), Peachtree-DeKalb (PDK) and Fulton County (FTY).",
      conventions:
        "Shuttles between hotels and the Georgia World Congress Center.",
      conventionNote:
        "Big convention weeks and game weekends sell out first. Reserve cars early.",
      weddingStops:
        "Piedmont Park, the Swan House or the Midtown skyline at golden hour.",
      weddingNote:
        "Getting married in Atlanta? We'll time the cars to the photos.",
      eventsDesc:
        "Mercedes-Benz Stadium, State Farm Arena, Truist Park and the Fox Theatre, dropped at the door and picked up after.",
      venues:
        "Mercedes-Benz Stadium, State Farm Arena, Truist Park and the Fox Theatre.",
      eventsNote:
        "Big game or concert night? Book as soon as you have tickets.",
    },
    chauffeursKnow: "the hotel entrances, the stadium lots and everywhere else",
    planAround: "Atlanta traffic, game-day crowds and road closures",
    noSurgeAfter: "the game, the concert or the show",
    bookEarlyFor: "game weekends, big conventions and holidays",
    aboutDrive:
      "the city, its airports and the North Georgia roads beyond them",
    licensed: "Licensed by the Georgia Department of Public Safety",
    license: {
      tag: "Georgia DPS",
      line: "Holds a Limousine Carrier Certificate from the Georgia Department of Public Safety, with the insurance the state requires.",
      chauffeurs:
        "Chauffeur-endorsed by the state, which means a background check before their first ride.",
      intro:
        "In Georgia, a company that drives you for hire needs a Limousine Carrier Certificate from the Department of Public Safety, and its chauffeurs need a state endorsement. Plenty of drivers on social media don't have one. We do, and here's what that means for you.",
      ask: "its Limousine Carrier Certificate",
    },
    pages: {
      terminalsTag: "Domestic and International",
      freeways: "I-85 and I-75",
      airportPickups:
        "Pickups at both Hartsfield-Jackson terminals, Peachtree-DeKalb and Fulton County",
      hourlyStops: "three stops in Buckhead",
      showAndDinner: "dinner and a show at the Fox",
      corporateIntro:
        "Atlanta fills up for conventions and big game weekends, and those weeks are when cars run out first.",
      conventionCenter: "the Georgia World Congress Center",
      bigWeek: "a big convention week",
      weddingIntro:
        "From getting ready to the ceremony, the ceremony to the reception, and the photos on the way. Your car runs on your schedule, not the meter.",
      weddingSpots:
        "the venues and the photo spots, from Piedmont Park to the Swan House and the Midtown skyline",
      weddingPhotoStops: "Piedmont Park, the Swan House or the Midtown skyline",
      weddingWho:
        "Couples marrying in Atlanta, wedding planners and venues arranging transport for their couples.",
      weddingCardSub: "Ceremony to reception",
      eventVenues: [
        "Mercedes-Benz Stadium",
        "State Farm Arena",
        "Truist Park",
        "the Fox Theatre",
      ],
      eventsIntro:
        "Mercedes-Benz Stadium, State Farm Arena, Truist Park and the clubs in Midtown and Buckhead.",
      bigNight: "a game night at Mercedes-Benz Stadium",
      eventsWho: "game weekends and concert nights",
      eventsBestFor: "Concerts, games, the clubs",
      p2pExample: "Buckhead to Downtown",
      p2pCardMore:
        "Hotel to restaurant, home to the airport, or across town to Midtown or Alpharetta.",
      dayTripsIntro:
        "Lake Lanier, the Dahlonega wineries, Helen, Chattanooga or Savannah.",
      dayTripsBest:
        "Lakes, mountains and wine country are an hour or two from the city",
      dayTripsTimes:
        "Lake Lanier is about an hour away, Dahlonega's wineries about an hour and a quarter, Chattanooga about two hours and Savannah about three and a half each way.",
      dayTripsPick: "Lake Lanier, Dahlonega, Chattanooga",
      dayTripsTitle: "Lake Lanier, Dahlonega & More",
      dayTripsCardSub: "Lake Lanier to Savannah",
      dayTripStat: { place: "Dahlonega", time: "1¼ hrs" },
      scenery: "the North Georgia mountains",
      hotelsWhere: "in Buckhead or Midtown",
      photos: {
        airport: {
          src: "/img6.jpg",
          alt: "Chauffeur standing beside a black car",
        },
        events: {
          src: "/markets/atlanta/hero.jpg",
          alt: "The Atlanta skyline at dusk",
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
            alt: "Black SUV parked under trees",
          },
        ],
      },
    },
    reviewTrip: "Night out in Midtown",
    fleet: {
      suvRide: "long drives up to the mountains",
      limo: "The classic Buckhead arrival.",
      climate: "the Georgia summer",
      heat: "the August humidity",
      dayTripKind: "day trips to the mountains",
      dayTrips: "Lake Lanier and Dahlonega",
      dayTripsLong: "Lake Lanier, Dahlonega and Helen",
      nightOut: "A night in Midtown",
      nightDrive: "the slow drive down Peachtree after dark",
      limoDrive: "a drive down Peachtree Street",
      teamTrips: "up to the lake",
    },
    roadAlt: "Black SUV on an open highway outside Atlanta",
    closingHeading: "Your go to ride in Atlanta",
    areas: {
      heading: "All of metro Atlanta → and the road trips beyond it",
      intro:
        "Buckhead, Midtown, Downtown, Alpharetta, Sandy Springs, Decatur and The Battery, plus day trips to Lake Lanier, Dahlonega, Chattanooga and Savannah.",
    },
    getaway: {
      eyebrow: "Beyond the city",
      heading: "The mountains start where the city ends",
      lead: "Lakes, wineries and the Blue Ridge, all within a drive of your hotel.",
      trips: [
        { name: "Lake Lanier", time: "1 hr" },
        { name: "Dahlonega", time: "1¼ hr" },
        { name: "Helen", time: "1½ hr" },
      ],
    },
    roadTrips: [
      { name: "Dahlonega wine country", copy: "About 1¼ hours each way" },
      { name: "Lake Lanier", copy: "About 1 hour each way" },
      { name: "Chattanooga", copy: "About 2 hours each way" },
      { name: "Savannah", copy: "About 3½ hours each way" },
    ],
  },
};
