import { tileToMiniplanetId, Tile } from '../src/index';

describe('tileToMiniplanetId', () => {
  it('works', () => {
    const truths: [Tile, string][] = [
      [[906, 404, 10], '14'],
      [[28265, 13483, 15], '13'],
      [[0,0,6], '16'],
      [[63,63,6], '17'],
    ];

    for (const [tile, id] of truths) {
      const generatedId = tileToMiniplanetId(tile);
      expect(generatedId).toStrictEqual(id);
    }
  });
});
