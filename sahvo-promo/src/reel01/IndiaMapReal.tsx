import React from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature, merge } from "topojson-client";
import type { FeatureCollection, Geometry, MultiPolygon } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import rawTopo from "./india-states.topo.json";

// REAL geography — no hand-drawn approximations.
// Source: `datamaps` npm package (MIT), whose per-country topologies derive
// from Natural Earth (public domain). Admin-1 polygons in geographic
// coordinates, rendered through d3-geo Mercator. Boundaries are shown as
// published by the source, unsimplified.

const topo = rawTopo as unknown as Topology<{ ind: GeometryCollection<{ name: string }> }>;

export const MAP_W = 900;
export const MAP_H = 990;

const states = feature(topo, topo.objects.ind) as FeatureCollection<Geometry, { name: string }>;

// Whole-country outline (all states/UTs merged, islands included).
const country = merge(
  topo,
  topo.objects.ind.geometries as Parameters<typeof merge>[1],
) as MultiPolygon;

const projection = geoMercator().fitExtent(
  [
    [20, 20],
    [MAP_W - 20, MAP_H - 20],
  ],
  { type: "Feature", geometry: country, properties: {} },
);
const path = geoPath(projection);

export const COUNTRY_D = path({ type: "Feature", geometry: country, properties: {} }) ?? "";

const rajasthanFeature = states.features.find((f) => f.properties.name === "Rajasthan");
export const RAJASTHAN_D = rajasthanFeature ? path(rajasthanFeature) ?? "" : "";

/** Project a [lon, lat] into map-local pixels. */
export const project = (lonLat: [number, number]): { x: number; y: number } => {
  const p = projection(lonLat);
  return { x: p?.[0] ?? 0, y: p?.[1] ?? 0 };
};

// True coordinates.
export const GEO = {
  jaipur: project([75.7873, 26.9124]),
  delhi: project([77.209, 28.6139]),
  ahmedabad: project([72.5714, 23.0225]),
  mumbai: project([72.8777, 19.076]),
  hyderabad: project([78.4867, 17.385]),
  bengaluru: project([77.5946, 12.9716]),
  chennai: project([80.2707, 13.0827]),
  kolkata: project([88.3639, 22.5726]),
  goa: project([73.8567, 15.4909]),
} as const;

/** The country + optional Rajasthan highlight, dark-system colours. */
export const IndiaMapReal: React.FC<{
  fill: string;
  stroke: string;
  rajasthanFill?: string;
  rajasthanOpacity?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ fill, stroke, rajasthanFill, rajasthanOpacity = 0, children, style }) => (
  <svg
    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
    style={{ display: "block", width: MAP_W, height: MAP_H, ...style }}
  >
    <path d={COUNTRY_D} fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
    {rajasthanFill && RAJASTHAN_D && (
      <path d={RAJASTHAN_D} fill={rajasthanFill} opacity={rajasthanOpacity} stroke={stroke} strokeWidth={1.2} />
    )}
    {children}
  </svg>
);
