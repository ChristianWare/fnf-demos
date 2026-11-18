// A market: everything about the city a demo is set in. The site's design
// and booking tool are the same everywhere; the market brings the city:
// its airports, areas, day trips, photos and the local phrasing in the
// copy ("the Strip", "Old Town Scottsdale", "Beverly Hills").
//
// One file per market in src/markets/. The active one comes from
// getMarket() (server) or useMarket() (client).

export type Photo = { src: string; alt: string };

export type MarketAirport = {
  code: string;
  name: string;
  /** How riders say it. */
  shortName: string;
  kind: "commercial" | "private" | "tours";
  /** Optional logo in /public. Until then a code tile shows. */
  logo?: string;
  /** Two short facts under the name. */
  meta: [string, string];
  copy: string;
  /** Street address and location, for the booking tool's airport list. */
  address: string;
  lat: number;
  lng: number;
};

export type MarketArea = {
  name: string;
  copy: string;
  /** Rough drive time from the main airport, without traffic. */
  fromAirport: string;
  /** Rough drive time from the center (Market.center), without traffic. */
  fromCenter: string;
  tag?: string;
};

export type Market = {
  id: string;
  city: string;
  state: string;
  stateCode: string;
  /** "Las Vegas, NV", under the logo. */
  label: string;
  /** The local area code, for phone placeholders: "702". */
  areaCode: string;
  /** IANA time zone the business runs on. */
  timeZone: string;
  /** Where the booking map opens and address search leans toward. */
  geo: { lat: number; lng: number };
  /** How the whole area is named: "the Las Vegas Valley". */
  region: string;
  /** The middle of things, that drive times count from: "the Strip".
   *  Reads after "From": "From the Strip", "From Downtown". */
  center: string;

  images: {
    /** Home page hero. A demo can swap in its own (see getPhotos()). */
    hero: Photo;
    /** A photo of the city ("Why choose us", "What we believe"). */
    city: Photo;
    /** The airport pickups card on the home page. */
    airport: Photo;
    /** Behind the closing call to book. */
    closing: Photo;
  };

  /** Main airport first: "Book an airport pickup" goes there. */
  airports: MarketAirport[];
  areas: MarketArea[];

  copy: {
    hero: { heading: [string, string]; subhead: string };
    /** Home "About" facts: "Serving the Las Vegas Valley". */
    serving: string;
    /** Home airport section heading. */
    airportHeading: string;
    /** The terminals row in "Every airport pickup". */
    terminals: { label: string; meta: string; value: string };
    /** Which airports have private aviation (FBOs): "LAS and Henderson". */
    privateAviation: string;
    /** Caption on the airport photo. */
    airportCaption: string;
    servicesHeading: string;
    services: {
      airportPhrase: string;
      airportDesc: string;
      airportList: string;
      conventions: string;
      conventionNote: string;
      weddingStops: string;
      weddingNote: string;
      eventsDesc: string;
      venues: string;
      eventsNote: string;
    };
    /** "…who know {chauffeursKnow}." */
    chauffeursKnow: string;
    /** "We plan around {planAround} so you never have to." */
    planAround: string;
    /** "No surge after {noSurgeAfter}." */
    noSurgeAfter: string;
    /** "For {bookEarlyFor}, book as early as you can." */
    bookEarlyFor: string;
    /** About hero: "We drive {aboutDrive} for travelers…" */
    aboutDrive: string;
    /** Who licenses the operator, for the About hero caption. */
    licensed: string;
    /** The About page's "Licensed by the state" card. Only what's true of
     *  every licensed operator in the state: no numbers, no names. */
    license: {
      /** Short tag on the license row: "NTA". */
      tag: string;
      /** The license row's copy. */
      line: string;
      /** The chauffeurs row's copy. */
      chauffeurs: string;
      /** The section intro. */
      intro: string;
      /** "…ask any company for {ask}." */
      ask: string;
    };
    /** The services pages' local details (src/lib/serviceDetails.ts) and
     *  the contact page's. */
    pages: {
      /** Airport transfers tag: "Terminals 1 and 3". */
      terminalsTag: string;
      /** "…traffic on {freeways}…" */
      freeways: string;
      /** The last "included" line on airport transfers. */
      airportPickups: string;
      /** "Dinner, a show, {hourlyStops}, a late night" */
      hourlyStops: string;
      /** "It's the easy way to do {showAndDinner}, a day of meetings…" */
      showAndDinner: string;
      /** Corporate intro's first sentence. */
      corporateIntro: string;
      conventionCenter: string;
      /** "Can you handle {bigWeek}?" */
      bigWeek: string;
      weddingIntro: string;
      /** "Your chauffeur knows {weddingSpots}, and waits…" */
      weddingSpots: string;
      /** "Stops for photos at {weddingPhotoStops}" */
      weddingPhotoStops: string;
      weddingWho: string;
      /** Services card line under Weddings. */
      weddingCardSub: string;
      eventVenues: string[];
      eventsIntro: string;
      /** "…how the traffic flows on {bigNight}…" */
      bigNight: string;
      /** "…bachelorette parties, {eventsWho}." */
      eventsWho: string;
      eventsBestFor: string;
      /** "A hotel to a meeting, a home to a restaurant, {p2pExample}." */
      p2pExample: string;
      p2pCardMore: string;
      dayTripsIntro: string;
      /** "{dayTripsBest}, but it's a long day behind the wheel." */
      dayTripsBest: string;
      /** The drive times sentence on day trips. */
      dayTripsTimes: string;
      /** "{dayTripsPick} or your own route." */
      dayTripsPick: string;
      /** Day trips page title: "… | {dayTripsTitle}". */
      dayTripsTitle: string;
      dayTripsCardSub: string;
      /** The day trips number: "45 min" to "Hoover Dam". */
      dayTripStat: { place: string; time: string };
      /** "…anyone who'd rather see {scenery} than drive it." */
      scenery: string;
      /** Contact: "Most rides start at {main airport} or a hotel {hotelsWhere}." */
      hotelsWhere: string;
      photos: {
        airport: Photo;
        events: Photo;
        eventsGallery: Photo;
        p2p: Photo;
        weddings: [Photo, Photo];
      };
    };
    /** A review card's trip. */
    reviewTrip: string;
    fleet: {
      /** "…and a calmer ride on {suvRide}." */
      suvRide: string;
      limo: string;
      /** "…clean and climate-controlled for {climate}." */
      climate: string;
      /** The heat the AC is for: "tri-zone climate for {heat}". */
      heat: string;
      /** SUV "best for": "Families, golf trips, {dayTripKind}". */
      dayTripKind: string;
      /** "Day trips to {dayTrips}". */
      dayTrips: string;
      /** "It's the one we recommend for {dayTripsLong}". */
      dayTripsLong: string;
      /** Limo "best for": "{nightOut}". */
      nightOut: string;
      /** "…the milestone birthday and {nightDrive}." */
      nightDrive: string;
      /** "…enough for photos, dinner and {limoDrive}." */
      limoDrive: string;
      /** Motor coach: "…and team trips {teamTrips}." */
      teamTrips: string;
    };
    /** Alt text of the open-road photo in "How it works". */
    roadAlt: string;
    closingHeading: string;
    areas: { heading: string; intro: string };
    /** The day-trip band ("Beyond the Strip"). */
    getaway: {
      eyebrow: string;
      heading: string;
      /** The first sentence; the hourly booking line follows. */
      lead: string;
      trips: { name: string; time: string }[];
    };
    /** Longer day trips, under the areas. */
    roadTrips: { name: string; copy: string }[];
  };
};
