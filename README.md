# BIBGEN

バイク用ゼッケンナンバージェネレーター

モトクロス、エンデューロ、ロードレースなど、バイクレース用のゼッケンを簡単に生成・印刷できるWebアプリケーションです。

## Features

- **サイズプリセット**: モトクロス、エンデューロ、ロードレース、ミニバイク用のプリセットサイズ
- **カスタムサイズ**: 任意のサイズを指定可能
- **フォント選択**: Electric Boots、Bebas Neue、Arial Black など
- **カラーテーマ**: 8種類のプリセットカラー + カスタムカラー
- **桁揃え**: なし / 2桁 (01) / 3桁 (001)
- **リアルタイムプレビュー**: 設定変更が即座に反映
- **印刷最適化**: A4用紙に最適化された印刷出力

## Tech Stack

- [Next.js 15](https://nextjs.org/) with Turbopack
- [React 19](https://react.dev/)
- [Base UI](https://base-ui.com/) - Unstyled UI components
- [Motion](https://motion.dev/) - Animation library
- [Geist Font](https://vercel.com/font) - Modern typography
- TypeScript

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Development

```bash
# Run linter
pnpm lint
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

© FUNAI RACING - [funairacing.com](https://funairacing.com/)
