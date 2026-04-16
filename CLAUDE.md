# CLAUDE.md

## Project Overview

`@geolonia/osm-miniplanets` - OSM planet.osm.pbf をサイズベースで分割するためのライブラリ。duodecim のカスタマイズ版。

## Commands

- `npm ci` - 依存関係のインストール
- `npm test` - テスト実行 (Jest)
- `npm run build` - ビルド (Rollup)
- `npm run coverage` - カバレッジ付きテスト実行

## Tech Stack

- TypeScript 6 / ES Modules (`"type": "module"`)
- Rollup 4 (バンドル、CJS + ESM 出力)
- Jest 30 + ts-jest (テスト)
- Node.js 22+

## Project Structure

- `src/index.ts` - メインソース（全エクスポート関数を含む）
- `tests/index.test.ts` - テスト
- `rollup.config.js` - Rollup 設定（ESM）
- `jest.config.cjs` - Jest 設定（CJS、`"type": "module"` のため `.cjs`）
- `tsconfig.json` - VSCode + Jest 用（src + tests、jest 型定義あり）
- `tsconfig.build.json` - Rollup ビルド用（src のみ、declaration 出力あり）
- `dist/` - ビルド出力（gitignore 対象）

## CI/CD

- GitHub Actions (`.github/workflows/build.yml`)
- タグ `v*` push 時に npm publish（OIDC provenance 付き）
- publish ジョブでは `npm@11.5.1` を明示的にインストール

## Conventions

- パッケージマネージャは npm を使用（yarn は使わない）
- テスト追加時は `tests/` ディレクトリに配置
