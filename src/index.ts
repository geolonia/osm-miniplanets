import tilebelt from "@mapbox/tilebelt";
import type { Feature, FeatureCollection, Point } from "geojson";

export const BASE_ZOOM = 6;

export type Tile = [number, number, number];
export type BBox = [number, number, number, number];

export const SUBDIVISIONS: BBox[] = [
  // tile coordinates in z=BASE_ZOOM
  // minx, miny, maxx, maxy
  [32, 24, 47, 31], //  0     00
  [32, 32, 63, 47], //  1     01
  [16, 16, 31, 23], //  2-0   02
  [16, 24, 31, 31], //  2-1   03
  [32, 16, 35, 19], //  3     04
  [32, 20, 33, 21], //  4-0   05
  [34, 20, 35, 21], //  4-1   06
  [32, 22, 33, 23], //  5-0   07
  [34, 22, 35, 23], //  5-1   08
  [36, 16, 47, 23], //  6     09
  [ 0, 32, 31, 47], //  7     10
  [48, 16, 55, 23], //  8-0   11
  [56, 16, 63, 23], //  8-1   12
  [48, 24, 55, 31], //  8-2   13
  [56, 24, 63, 31], //  8-3   14
  [ 0, 16, 15, 31], //  9     15
  [ 0,  0, 63, 15], // 10     16
  [ 0, 48, 63, 63], // 11     17
];

export function generateGeoJSON(): FeatureCollection {
  const features: Feature[] = [];

  for (const [index, extract] of SUBDIVISIONS.entries()) {
    const id = index.toString().padStart(2, '0');
    const minTile = tilebelt.tileToBBOX([extract[0], extract[1], BASE_ZOOM]);
    const maxTile = tilebelt.tileToBBOX([extract[2], extract[3], BASE_ZOOM]);
    const bbox = [
      minTile[0], maxTile[1],
      maxTile[2], minTile[3],
    ];
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [bbox[0], bbox[3]],
            [bbox[0], bbox[1]],
            [bbox[2], bbox[1]],
            [bbox[2], bbox[3]],
            [bbox[0], bbox[3]],
          ]
        ],
      },
      properties: {
        id,
        label: `tile id=${id}`,
        bbox,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

function doBBoxIntersect(r1: BBox, r2: BBox) {
  // adapted from https://gamedev.stackexchange.com/a/913
  // https://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
  return !(
       r2[0] >  r1[2]
    || r2[2] <= r1[0]
    || r2[1] >  r1[3]
    || r2[3] <= r1[1]
  );
}

function calculateTileBBox(tile: Tile): BBox {
  if (tile[2] === BASE_ZOOM) {
    // no conversion needs to be done here
    return [tile[0], tile[1], tile[0]+1, tile[1]+1];
  } else if (tile[2] > BASE_ZOOM) {
    // because the tile zoom is greater than the base zoom, just calculate the
    // grandparent of this tile at zoom BASE_ZOOM
    const ZDiff = tile[2] - BASE_ZOOM;
    const tileAtBZ = [tile[0] >> ZDiff, tile[1] >> ZDiff, tile[2] - ZDiff];
    return [tileAtBZ[0], tileAtBZ[1], tileAtBZ[0]+1, tileAtBZ[1]+1];
  } else if (tile[2] < BASE_ZOOM) {
    const ZDiff = BASE_ZOOM - tile[2];
    return [
      tile[0] << ZDiff,
      tile[1] << ZDiff,
      ((tile[0] + 1) << ZDiff) - 1,
      ((tile[1] + 1) << ZDiff) - 1,
    ];
  }
}

export function tileToMiniplanetId(tile: Tile): undefined | string {
  const tileBbox = calculateTileBBox(tile);

  for (const [index, bbox] of SUBDIVISIONS.entries()) {
    // TODO: this is just a quick intersection check, so querying at zooms
    // less than BASE_ZOOM may have some unexpected results.
    if (doBBoxIntersect(bbox, tileBbox)) {
      const id = index.toString().padStart(2, '0');
      return id;
    }
  }
  return undefined;
}
