import { tileToMiniplanetId, Tile } from '../src/index';

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
});
