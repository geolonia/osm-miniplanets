import { tileToMiniplanetId, generateGeoJSON, calculateMiniplanetTiles, SUBDIVISIONS, BASE_ZOOM, Tile } from '../src/index';

describe('tileToMiniplanetId', () => {
  it('works', () => {
    const truths: [Tile, string][] = [
      [[906, 404, 10], '14'],
      [[28265, 13483, 15], '13'], // 屋久島中心
      [[0,0,6], '16'],
      [[63,63,6], '17'],
      [[64, 44, 7], '07'], // Paris
      [[67, 47, 7], '07'], // Corsica
      [[67, 48, 7], '00'], // Sardinia
      [[243, 191, 9], '02'], // Porto, Portugal
      [[496, 402, 10], '03'], // Strait of Gibraltar

      [[55, 25, 6], '13'], // 四国、広島など。鹿児島以外の九州含む
      [[56, 25, 6], '14'], // 東京、大阪
      [[57, 23, 6], '12'], // 北海道


      [[55, 23, 6], '11'], // bottom-right most corner of 11
      [[56, 23, 6], '12'], // bottom-left most corner of 12
      [[55, 24, 6], '13'], // top-right most corner of 13
      [[56, 24, 6], '14'], // top-left most corner of 14
    ];

    for (const [tile, id] of truths) {
      const generatedId = tileToMiniplanetId(tile);
      expect(generatedId).toStrictEqual(id);
    }
  });

  it('returns undefined if the tile is less than the base zoom', () => {
    const tiles: Tile[] = [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
      [0, 0, 5],
    ];
    for (const tile of tiles) {
      const generatedId = tileToMiniplanetId(tile);
      expect(generatedId).toBeUndefined();
    }
  });
});

describe('generateGeoJSON', () => {
  it('returns a FeatureCollection with one feature per subdivision', () => {
    const geojson = generateGeoJSON();
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features.length).toBe(SUBDIVISIONS.length);
  });

  it('each feature has correct structure and id', () => {
    const geojson = generateGeoJSON();
    for (const [index, feature] of geojson.features.entries()) {
      const expectedId = index.toString().padStart(2, '0');
      expect(feature.type).toBe('Feature');
      expect(feature.geometry.type).toBe('Polygon');
      expect(feature.properties?.id).toBe(expectedId);
      expect(feature.properties?.label).toBe(`tile id=${expectedId}`);
      expect(feature.properties?.bbox).toHaveLength(4);

      // Polygon should be a closed ring with 5 coordinates
      if (feature.geometry.type === 'Polygon') {
        const ring = feature.geometry.coordinates[0];
        expect(ring).toHaveLength(5);
        expect(ring[0]).toStrictEqual(ring[4]);
      }
    }
  });
});

describe('calculateMiniplanetTiles', () => {
  it('returns one tile array per subdivision', () => {
    const tiles = calculateMiniplanetTiles();
    expect(tiles.length).toBe(SUBDIVISIONS.length);
  });

  it('merged tiles have zoom level <= BASE_ZOOM', () => {
    const tiles = calculateMiniplanetTiles();
    for (const tileset of tiles) {
      for (const tile of tileset) {
        expect(tile[2]).toBeLessThanOrEqual(BASE_ZOOM);
      }
    }
  });

  it('merged tiles cover all original tiles for each subdivision', () => {
    const allTiles = calculateMiniplanetTiles();
    for (const [i, bbox] of SUBDIVISIONS.entries()) {
      // Count original tiles at BASE_ZOOM
      const originalCount = (bbox[2] - bbox[0] + 1) * (bbox[3] - bbox[1] + 1);

      // Count tiles covered by merged result (expand each tile back to BASE_ZOOM)
      let mergedCount = 0;
      for (const tile of allTiles[i]) {
        const zDiff = BASE_ZOOM - tile[2];
        mergedCount += (1 << zDiff) * (1 << zDiff);
      }
      expect(mergedCount).toBe(originalCount);
    }
  });
});
