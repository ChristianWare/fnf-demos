"use client";

// The airport map itself: each airport as a marker with its code and name,
// and the selected airport's grounds outlined in gold, one at a time.
// AirportMap owns which airport is hovered and selected and where the map
// is looking; this draws them. Hovering a marker reports it back, so its
// pill lights up too, and clicking one selects it.
//
// Selecting an airport flies in close enough to see its runways. Between
// two airports near each other it zooms out to all of them first, then in;
// between two far apart (a statewide market) it flies straight there.
// Visitors who ask for less motion get jumps instead.
//
// Free map tiles (OpenFreeMap) and the grounds from public/geo: no keys,
// no cost per view.

import { useEffect, useRef } from "react";
// The CSP build loads its worker from a separate file, which the bundler
// copies as is. The default build makes the worker from its own code, and
// the bundler's rewrite of that code breaks it.
import maplibregl from "maplibre-gl/dist/maplibre-gl-csp";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  AIRPORT_GROUNDS_GEOJSON,
  AIRPORT_MAP_STYLE,
  type MapAirport,
} from "@/lib/airportMap";
import styles from "./AirportMap.module.css";

maplibregl.setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-csp-worker.js", import.meta.url).href,
);

type Props = {
  airports: MapAirport[];
  bounds: [number, number, number, number];
  hovered: string | null;
  /** The airport whose grounds are outlined. */
  selected: string;
  /** Where to look: an airport, or every airport (null). */
  focus: string | null;
  /** Goes up with each request to move, so a repeat still moves. */
  moves: number;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  /** The "show everything" button. */
  onReset: () => void;
};

/** The site's gold (--accent). */
const ACCENT = "#ff9f00";

/** How close to come in on an airport: enough to see its runways. */
const AIRPORT_ZOOM = { commercial: 12.6, private: 13.4, tours: 13.4 } as const;

/** A little further out on a phone-sized map, so the grounds fit. */
const zoomFor = (kind: MapAirport["kind"], el: HTMLElement | null) =>
  AIRPORT_ZOOM[kind] - ((el?.clientWidth ?? 800) < 600 ? 0.9 : 0);

/** Further apart than this, fly straight there instead of out and in. */
const FAR_KM = 90;

const km = (a: MapAirport, b: MapAirport) => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) *
      Math.cos(rad(b.lat)) *
      Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Room around the airports when we fit them to the map. */
const paddingFor = (el: HTMLElement | null) =>
  (el?.clientWidth ?? 800) < 500 ? 40 : 80;

export default function AirportMapCanvas({
  airports,
  bounds,
  hovered,
  selected,
  focus,
  moves,
  onHover,
  onSelect,
  onReset,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, HTMLElement>>({});
  const readyRef = useRef(false);
  // Where the map opened (AirportMap starts on the main airport).
  const prevFocusRef = useRef<string | null>(focus);
  const moveRef = useRef(0);
  // The latest props, for the map's own event handlers.
  const latest = useRef({ hovered, selected, onHover, onSelect, airports });

  useEffect(() => {
    latest.current = { hovered, selected, onHover, onSelect, airports };
  });

  // ── The selected airport's grounds, and the markers' classes ──
  const paint = () => {
    const { hovered: h, selected: sel, airports: list } = latest.current;
    for (const a of list) {
      const el = markersRef.current[a.slug];
      if (el) {
        el.classList.toggle(styles.airportHover, a.slug === h);
        el.classList.toggle(styles.airportSelected, a.slug === sel);
      }
      const map = mapRef.current;
      if (map && readyRef.current) {
        map.setFeatureState(
          { source: "grounds", id: a.slug },
          { selected: a.slug === sel },
        );
      }
    }
  };

  // ── Set up the map once ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    // Open on the airport in focus, or every airport.
    const start = airports.find((a) => a.slug === prevFocusRef.current);
    const map = new maplibregl.Map({
      container: el,
      style: AIRPORT_MAP_STYLE,
      ...(start
        ? { center: [start.lng, start.lat], zoom: zoomFor(start.kind, el) }
        : { bounds, fitBoundsOptions: { padding: paddingFor(el) } }),
      attributionControl: false,
      // Scrolling the page past the map shouldn't zoom it; two fingers
      // (or Ctrl + scroll) move it.
      cooperativeGestures: true,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left",
    );
    mapRef.current = map;

    // Zoomed out, the cards shrink to their codes; on a phone-sized map,
    // to just the dots, with the code on the hovered or selected one.
    const sizeMarkers = () => {
      const z = map.getZoom();
      el.classList.toggle(styles.compact, z < 10);
      el.classList.toggle(styles.tiny, el.clientWidth < 600 && z < 9.5);
    };
    sizeMarkers();
    map.on("zoom", sizeMarkers);
    map.on("resize", sizeMarkers);

    // The card can grow after the map is made (the cards beside it set its
    // height): keep the map filling it.
    const fit = new ResizeObserver(() => map.resize());
    fit.observe(el);

    const choose = (slug: string) => latest.current.onSelect(slug);

    // One marker per airport: the dot on the airport, its code and name
    // above, and "Book a pickup" once it's selected.
    const markers = airports.map((a) => {
      const m = document.createElement("div");
      m.className = `${styles.airport} ${a.kind !== "commercial" ? styles.airportPrivate : ""}`;
      m.setAttribute("aria-hidden", "true");

      const card = document.createElement("button");
      card.type = "button";
      card.tabIndex = -1;
      card.className = styles.airportCard;
      const code = document.createElement("strong");
      code.textContent = a.code;
      const name = document.createElement("span");
      name.textContent = a.name;
      card.append(code, name);

      const link = document.createElement("a");
      link.href = a.href;
      link.tabIndex = -1;
      link.className = styles.airportLink;
      link.textContent = "Book a pickup →";
      link.addEventListener("click", (e) => e.stopPropagation());

      const dot = document.createElement("span");
      dot.className = styles.airportDot;

      m.append(link, card, dot);
      m.addEventListener("click", (e) => {
        e.stopPropagation();
        choose(a.slug);
      });
      m.addEventListener("mouseenter", () => latest.current.onHover(a.slug));
      m.addEventListener("mouseleave", () => latest.current.onHover(null));
      markersRef.current[a.slug] = m;

      // The dot sits on the airport; the card stacks above it.
      return new maplibregl.Marker({
        element: m,
        anchor: "bottom",
        offset: [0, 11],
      })
        .setLngLat([a.lng, a.lat])
        .addTo(map);
    });
    paint();

    const data = fetch(AIRPORT_GROUNDS_GEOJSON).then((r) => r.json());

    // The airports' grounds, under the map's own labels. Only the selected
    // one shows: a light gold fill and a dashed gold edge.
    map.on("load", async () => {
      let geo: GeoJSON.FeatureCollection;
      try {
        geo = (await data) as GeoJSON.FeatureCollection;
      } catch {
        return;
      }
      if (cancelled) return;
      const firstSymbol = map
        .getStyle()
        .layers.find((l) => l.type === "symbol")?.id;
      map.addSource("grounds", {
        type: "geojson",
        data: geo,
        promoteId: "slug",
      });
      map.addLayer(
        {
          id: "grounds-fill",
          type: "fill",
          source: "grounds",
          paint: {
            "fill-color": ACCENT,
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.22,
              0,
            ],
            "fill-opacity-transition": { duration: 300 },
          },
        },
        firstSymbol,
      );
      map.addLayer(
        {
          id: "grounds-line",
          type: "line",
          source: "grounds",
          paint: {
            "line-color": ACCENT,
            "line-width": 2.5,
            "line-dasharray": [2, 1.5],
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              1,
              0,
            ],
          },
        },
        firstSymbol,
      );
      readyRef.current = true;
      paint();
    });

    return () => {
      cancelled = true;
      fit.disconnect();
      readyRef.current = false;
      markers.forEach((m) => m.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
    // The map is set up once; markets don't change on a page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hover and selection: restyle ──
  useEffect(() => {
    paint();
  });

  // ── Focus: move the camera ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || moves === 0) return;
    const prev = prevFocusRef.current;
    prevFocusRef.current = focus;

    const move = ++moveRef.current;
    const instant = reducedMotion();
    const padding = paddingFor(containerRef.current);
    const to = airports.find((x) => x.slug === focus);
    const from = airports.find((x) => x.slug === prev);

    const goTo = (duration: number) => {
      if (move !== moveRef.current) return;
      if (!to) {
        map.fitBounds(bounds, { padding, duration: instant ? 0 : 1000 });
        return;
      }
      map.flyTo({
        center: [to.lng, to.lat],
        zoom: zoomFor(to.kind, containerRef.current),
        duration: instant ? 0 : duration,
        essential: true,
      });
    };

    // Two airports far apart: one straight flight.
    if (from && to && from !== to && !instant && km(from, to) > FAR_KM) {
      goTo(2000);
      return;
    }
    // Near each other: out to every airport, then in.
    if (from && to && from !== to && !instant) {
      map.fitBounds(bounds, { padding, duration: 700 });
      let done = false;
      const next = () => {
        if (done) return;
        done = true;
        goTo(1300);
      };
      map.once("moveend", next);
      const t = setTimeout(next, 900);
      return () => clearTimeout(t);
    }
    goTo(1300);
    // Moves when asked to (moves), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves]);

  const zoom = (by: 1 | -1) => {
    const map = mapRef.current;
    if (!map) return;
    const duration = reducedMotion() ? 0 : 300;
    if (by > 0) map.zoomIn({ duration });
    else map.zoomOut({ duration });
  };

  return (
    <>
      <div
        ref={containerRef}
        className={styles.map}
        role='region'
        aria-label='Map of the airports we serve'
      />
      <div className={styles.controls}>
        <button
          type='button'
          className={styles.control}
          onClick={() => zoom(1)}
          aria-label='Zoom in'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M12 5v14M5 12h14' />
          </svg>
        </button>
        <button
          type='button'
          className={styles.control}
          onClick={() => zoom(-1)}
          aria-label='Zoom out'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M5 12h14' />
          </svg>
        </button>
        <button
          type='button'
          className={styles.control}
          onClick={onReset}
          aria-label='Show all airports'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <circle cx='12' cy='12' r='3' />
            <path d='M12 2v3M12 19v3M2 12h3M19 12h3' />
          </svg>
        </button>
      </div>
    </>
  );
}
