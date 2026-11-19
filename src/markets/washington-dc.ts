// Washington, DC: the District and the Maryland and Virginia suburbs.

import type { Market } from "./types";

export const WASHINGTON_DC: Market = {
  id: "washington-dc",
  city: "Washington, DC",
  state: "District of Columbia",
  stateCode: "DC",
  label: "Washington, DC",
  areaCode: "202",
  timeZone: "America/New_York",
  geo: { lat: 38.9072, lng: -77.0369 },
  region: "the DC area",
  center: "Downtown",

  images: {
    hero: {
      src: "/markets/washington-dc/hero.jpg",
      alt: "The Capitol and the National Mall at dusk",
    },
    // Until DC has its own city and airport photos, these are photos that
    // could be anywhere.
    city: {
      src: "/images/other/aboutHeroiii.png",
      alt: "Black SUV waiting at a hotel entrance",
    },
    airport: {
      src: "/img6.jpg",
      alt: "Chauffeur waiting beside a black car",
    },
    closing: {
      src: "/markets/washington-dc/hero.jpg",
      alt: "Washington, DC at dusk",
    },
  },

  airports: [
    {
      code: "DCA",
      name: "Ronald Reagan Washington National Airport",
      shortName: "Reagan National",
      kind: "commercial",
      meta: ["Terminals 1 and 2", "About 15 min to Downtown"],
      copy: "The closest airport to the city and our most-driven route. Flight tracking, a name sign in baggage claim and free wait after you land.",
      address: "2401 Smith Blvd, Arlington, VA 22202",
      lat: 38.8512,
      lng: -77.0402,
    },
    {
      code: "IAD",
      name: "Washington Dulles International Airport",
      shortName: "Dulles",
      kind: "commercial",
      meta: ["International flights", "About 45 min to Downtown"],
      copy: "DC's international airport, out in Northern Virginia. We meet you after customs, with the same flight tracking.",
      address: "1 Saarinen Cir, Dulles, VA 20166",
      lat: 38.9531,
      lng: -77.4565,
    },
    {
      code: "BWI",
      name: "Baltimore/Washington International Thurgood Marshall Airport",
      shortName: "BWI",
      kind: "commercial",
      meta: ["One terminal", "About 50 min to Downtown"],
      copy: "Often the cheaper flight, between DC and Baltimore. We'll handle the drive in.",
      address: "7050 Friendship Rd, Baltimore, MD 21240",
      lat: 39.1774,
      lng: -76.6684,
    },
    {
      code: "HEF",
      name: "Manassas Regional Airport",
      shortName: "Manassas",
      kind: "private",
      meta: ["Private aviation", "About 50 min to Downtown"],
      copy: "Private and charter flights in Northern Virginia, without the Dulles crowds. We meet the aircraft at the FBO, not a curb.",
      address: "10600 Harry J Parrish Blvd, Manassas, VA 20110",
      lat: 38.7214,
      lng: -77.5154,
    },
  ],

  places: [
    {
      name: "Four Seasons Hotel Washington, DC",
      address: "2800 Pennsylvania Ave NW, Washington, DC 20007",
      lat: 38.9045,
      lng: -77.0573,
    },
    {
      name: "The Hay-Adams",
      address: "800 16th St NW, Washington, DC 20006",
      lat: 38.9008,
      lng: -77.0367,
    },
    {
      name: "Walter E. Washington Convention Center",
      address: "801 Allen Y. Lew Pl NW, Washington, DC 20001",
      lat: 38.9051,
      lng: -77.023,
    },
  ],

  areas: [
    {
      name: "Georgetown",
      copy: "M Street, the waterfront and the grand hotels.",
      fromAirport: "15 min",
      fromCenter: "10 min",
      tag: "Most booked",
    },
    {
      name: "Downtown",
      copy: "The convention center, Capital One Arena and the White House blocks.",
      fromAirport: "15 min",
      fromCenter: "Here",
    },
    {
      name: "Capitol Hill",
      copy: "The Capitol, Union Station and the Hill's restaurants.",
      fromAirport: "15 min",
      fromCenter: "10 min",
    },
    {
      name: "Arlington",
      copy: "The Pentagon, Rosslyn and Crystal City.",
      fromAirport: "10 min",
      fromCenter: "15 min",
    },
    {
      name: "Alexandria",
      copy: "Old Town's waterfront and King Street.",
      fromAirport: "10 min",
      fromCenter: "20 min",
    },
    {
      name: "Bethesda",
      copy: "Downtown Bethesda, NIH and Chevy Chase.",
      fromAirport: "30 min",
      fromCenter: "25 min",
    },
    {
      name: "Tysons",
      copy: "The offices, Tysons Corner and Tysons Galleria.",
      fromAirport: "25 min",
      fromCenter: "30 min",
    },
  ],

  copy: {
    hero: {
      heading: ["Executive Black Car", "Service in Washington, DC"],
      subhead:
        "Black car service across the DC area, from Reagan National and Dulles to Georgetown, Capitol Hill, Arlington and beyond. Your price shows before you book, and your chauffeur tracks your flight.",
    },
    serving: "Serving the DC area",
    airportHeading:
      "Landing at Reagan National or Dulles? Your chauffeur's already there.",
    terminals: {
      label: "Reagan National, Dulles and BWI",
      meta: "All three airports",
      value: "DCA · IAD · BWI",
    },
    privateAviation: "Dulles and Manassas",
    airportCaption: "Ronald Reagan Washington National · DCA",
    servicesHeading: "One call for every ride in DC",
    services: {
      airportPhrase: "DCA, IAD and BWI",
      airportDesc:
        "Reagan National, Dulles and BWI, with flight tracking and meet & greet.",
      airportList:
        "Reagan National (DCA), Dulles (IAD), BWI and Manassas (HEF).",
      conventions:
        "Shuttles between hotels and the Walter E. Washington Convention Center.",
      conventionNote:
        "Inauguration week, the big conferences and cherry blossom season sell out first. Reserve cars early.",
      weddingStops:
        "The monuments, Georgetown's waterfront or the cherry blossoms in spring.",
      weddingNote: "Getting married in DC? We'll time the cars to the photos.",
      eventsDesc:
        "Capital One Arena, Nationals Park, Audi Field and the Kennedy Center, dropped at the door and picked up after.",
      venues:
        "Capital One Arena, Nationals Park, Audi Field and the Kennedy Center.",
      eventsNote:
        "Big game, gala or concert night? Book as soon as you have tickets.",
    },
    chauffeursKnow:
      "the hotel entrances, the security checkpoints and everywhere else",
    planAround: "Beltway traffic, motorcades and road closures",
    noSurgeAfter: "the game, the gala or the show",
    bookEarlyFor: "inauguration week, cherry blossom season and holidays",
    aboutDrive:
      "the District, Maryland, Virginia and the airports between them",
    licensed: "Licensed for hire across the DC area",
    license: {
      tag: "DC area",
      line: "Licensed to carry passengers for hire in the DC area, with the operating authority and insurance the trips we drive require.",
      chauffeurs:
        "Background-checked before their first ride, and checked again on a set schedule.",
      intro:
        "Around DC, a company that drives you for hire needs operating authority from the District, Maryland or Virginia, depending on where it's based and where it drives. Plenty of drivers on social media don't have it. We do, and here's what that means for you.",
      ask: "its operating authority and proof of insurance",
    },
    pages: {
      terminalsTag: "DCA, IAD and BWI",
      freeways: "the Beltway and the GW Parkway",
      airportPickups: "Pickups at Reagan National, Dulles, BWI and Manassas",
      hourlyStops: "three stops in Georgetown",
      showAndDinner: "dinner and a show at the Kennedy Center",
      corporateIntro:
        "DC fills up for conferences, galas and inauguration week, and those weeks are when cars run out first.",
      conventionCenter: "the Walter E. Washington Convention Center",
      bigWeek: "inauguration week",
      weddingIntro:
        "From getting ready to the ceremony, the ceremony to the reception, and the photos on the way. Your car runs on your schedule, not the meter.",
      weddingSpots:
        "the venues and the photo spots, from the monuments to Georgetown's waterfront",
      weddingPhotoStops:
        "the Lincoln Memorial, Georgetown's waterfront or the cherry blossoms",
      weddingWho:
        "Couples marrying in DC, Maryland and Virginia, wedding planners and venues arranging transport for their couples.",
      weddingCardSub: "Ceremony to reception",
      eventVenues: [
        "Capital One Arena",
        "Nationals Park",
        "Audi Field",
        "the Kennedy Center",
      ],
      eventsIntro:
        "Capital One Arena, Nationals Park, the Kennedy Center and the clubs on U Street.",
      bigNight: "a game night at Capital One Arena",
      eventsWho: "galas, game nights and inauguration week",
      eventsBestFor: "Galas, games, concerts",
      p2pExample: "Georgetown to Capitol Hill",
      p2pCardMore:
        "Hotel to restaurant, home to the airport, or across the river to Arlington or Alexandria.",
      dayTripsIntro:
        "Annapolis, Virginia wine country, Shenandoah, Baltimore's Inner Harbor or Mount Vernon.",
      dayTripsBest:
        "Wine country, the mountains and the Chesapeake are an hour or two from the city",
      dayTripsTimes:
        "Mount Vernon is about 30 minutes away, Annapolis and Baltimore's Inner Harbor about an hour, Middleburg's wineries about an hour and a quarter and Shenandoah about an hour and a half each way.",
      dayTripsPick: "Annapolis, Middleburg, Shenandoah",
      dayTripsTitle: "Annapolis, Wine Country & More",
      dayTripsCardSub: "Annapolis to Shenandoah",
      dayTripStat: { place: "Annapolis", time: "1 hr" },
      scenery: "the Virginia countryside",
      hotelsWhere: "in Georgetown or Downtown",
      photos: {
        airport: {
          src: "/img6.jpg",
          alt: "Chauffeur standing beside a black car",
        },
        events: {
          src: "/markets/washington-dc/hero.jpg",
          alt: "Washington, DC at dusk",
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
    reviewTrip: "Night out in Georgetown",
    fleet: {
      suvRide: "long drives out to wine country",
      limo: "The classic gala arrival.",
      climate: "DC's hot summers and cold winters",
      heat: "the July humidity",
      dayTripKind: "day trips to wine country",
      dayTrips: "Middleburg and Annapolis",
      dayTripsLong: "Middleburg, Annapolis and Shenandoah",
      nightOut: "A night in Georgetown",
      nightDrive: "the slow drive past the monuments after dark",
      limoDrive: "a drive past the monuments",
      teamTrips: "out to wine country",
    },
    roadAlt: "Black SUV on an open highway outside Washington, DC",
    closingHeading: "Your go to ride in DC",
    areas: {
      heading: "All of the DC area → and the road trips beyond it",
      intro:
        "Georgetown, Downtown, Capitol Hill, Arlington, Alexandria, Bethesda and Tysons, plus day trips to Annapolis, Middleburg, Shenandoah and Baltimore.",
    },
    getaway: {
      eyebrow: "Beyond the Beltway",
      heading: "Wine country starts where the city ends",
      lead: "Vineyards, the Chesapeake and the Blue Ridge, all within a drive of your hotel.",
      trips: [
        { name: "Mount Vernon", time: "30 min" },
        { name: "Annapolis", time: "1 hr" },
        { name: "Middleburg", time: "1¼ hr" },
      ],
    },
    roadTrips: [
      { name: "Annapolis", copy: "About 1 hour each way" },
      { name: "Baltimore's Inner Harbor", copy: "About 1 hour each way" },
      { name: "Virginia wine country", copy: "About 1¼ hours each way" },
      { name: "Shenandoah National Park", copy: "About 1½ hours each way" },
    ],
  },
};
