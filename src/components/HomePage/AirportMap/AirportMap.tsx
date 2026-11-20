"use client";

// Airport service: a map of the market's airports beside a pill for each.
// One airport is selected at a time, the market's main one to start, with
// the map in close: its grounds are outlined in gold and its marker and
// pill are gold. Hovering a pill (or a marker) lights both up; clicking one
// selects it and flies the map to it.
//
// Wide screens: map on the left, intro and pills stacked on the right.
// Below 1068px: intro, map, pills.
//
// The map (MapLibre, AirportMapCanvas) loads when the section nears the
// screen; until then the card shows a quiet placeholder.

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import PulseEyeBrow from "@/components/shared/PulseEyeBrow/PulseEyeBrow";
import ArrowButton from "@/components/shared/ArrowButton/ArrowButton";
import MountainIcon from "@/components/shared/icons/MountainIcon/MountainIcon";
import type { MapAirport } from "@/lib/airportMap";
import styles from "./AirportMap.module.css";

function MapPlaceholder() {
  return (
    <div className={styles.placeholder} aria-hidden='true'>
      <MountainIcon className={styles.placeholderIcon} />
    </div>
  );
}

const AirportMapCanvas = dynamic(() => import("./AirportMapCanvas"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

const GROUP_LABELS: Record<MapAirport["kind"], string> = {
  commercial: "Commercial",
  private: "Private aviation",
  tours: "Air tours",
};

export default function AirportMap({
  airports,
  bounds,
  region,
  copy,
}: {
  airports: MapAirport[];
  bounds: [number, number, number, number];
  region: string;
  copy: string;
}) {
  const first = airports[0]?.slug ?? "";
  const [hovered, setHovered] = useState<string | null>(null);
  // Always one airport selected. `focus` is where the map is looking: an
  // airport, or every airport (null). `moves` counts the requests, so
  // clicking the selected airport again still flies to it.
  const [selected, setSelected] = useState<string>(first);
  const [focus, setFocus] = useState<string | null>(first);
  const [moves, setMoves] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const mapCardRef = useRef<HTMLDivElement | null>(null);

  // Load the map once the section is within a screen or so.
  useEffect(() => {
    const el = mapCardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (slug: string) => {
    setSelected(slug);
    setFocus(slug);
    setMoves((n) => n + 1);
  };
  // Back to every airport, with the main one selected again.
  const reset = () => {
    setSelected(first);
    setFocus(null);
    setMoves((n) => n + 1);
  };
  const leave = (slug: string) => setHovered((h) => (h === slug ? null : h));

  const groups = (["commercial", "private", "tours"] as const)
    .map((kind) => ({
      kind,
      label: GROUP_LABELS[kind],
      airports: airports.filter((a) => a.kind === kind),
    }))
    .filter((g) => g.airports.length);

  if (!airports.length) return null;

  return (
    <section className={styles.section} aria-labelledby='airport-map-heading'>
      <LayoutWrapper>
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.intro}`}>
            <PulseEyeBrow text='Airport service' />
            <h2 id='airport-map-heading' className={styles.heading}>
              Your chauffeur at{" "}
              <span className={styles.headingAccent}>every airport.</span>
            </h2>
            <p className={styles.copy}>
              Black car service across {region}. {copy}
            </p>
          </div>

          <div ref={mapCardRef} className={styles.mapCard}>
            {showMap ? (
              <AirportMapCanvas
                airports={airports}
                bounds={bounds}
                hovered={hovered}
                selected={selected}
                focus={focus}
                moves={moves}
                onHover={setHovered}
                onSelect={select}
                onReset={reset}
              />
            ) : (
              <MapPlaceholder />
            )}
          </div>

          <div className={`${styles.card} ${styles.areas}`}>
            <h3 className={`${styles.areasTitle} h5`}>Airports we serve</h3>
            {groups.map((g) => (
              <div key={g.kind} className={styles.group}>
                <p className={styles.groupLabel}>{g.label}</p>
                <ul className={styles.pills}>
                  {g.airports.map((a) => {
                    const isSelected = selected === a.slug;
                    return (
                      <li key={a.slug}>
                        <button
                          type='button'
                          className={`${styles.pill} ${
                            hovered === a.slug ? styles.pillHover : ""
                          } ${isSelected ? styles.pillSelected : ""}`}
                          aria-pressed={isSelected}
                          onClick={() => select(a.slug)}
                          onMouseEnter={() => setHovered(a.slug)}
                          onMouseLeave={() => leave(a.slug)}
                          onFocus={() => setHovered(a.slug)}
                          onBlur={() => leave(a.slug)}
                        >
                          <span className={styles.pillDot} aria-hidden='true' />
                          <span className={styles.pillText}>{a.name}</span>
                          <span className={styles.pillCode}>{a.code}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className={styles.actions}>
              <ArrowButton
                href='/book?trip=from-airport'
                text='Book an airport pickup'
                variant='midnight'
              />
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
