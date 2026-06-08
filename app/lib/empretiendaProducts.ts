export interface StockProduct {
  url: string
  image: string
  name: string
  price: string
}

function parseStockProducts(html: string): StockProduct[] {
  const products: StockProduct[] = []

  // Match image anchors pointing to productos-en-stock URLs with CloudFront images
  const productPattern =
    /<a\s+[^>]*href="(https:\/\/innova54store\.empretienda\.com\.ar\/productos-en-stock\/[^"]+)"[^>]*>\s*<img\s[^>]*src="(https:\/\/d22fxaf9t8d39k\.cloudfront\.net\/[^"]+)"[^>]*alt="Producto\s*-\s*([^"]+)"[^>]*\/?>\s*<\/a>/g

  let match
  while ((match = productPattern.exec(html)) !== null) {
    const url = match[1]
    const image = match[2]
    const name = match[3].trim()

    // Look for price pattern "$XX.000,00" within the next ~600 chars after the card anchor
    const remainder = html.slice(match.index + match[0].length, match.index + match[0].length + 600)
    const priceMatch = remainder.match(/\$[\d.,]+/)
    const price = priceMatch ? priceMatch[0] : ''

    products.push({ url, image, name, price })
  }

  return products
}

export async function getStockProducts(): Promise<StockProduct[]> {
  if (process.env.NODE_ENV !== 'production') return []
  try {
    const res = await fetch('https://innova54store.empretienda.com.ar/productos', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []

    const html = await res.text()
    return parseStockProducts(html)
  } catch {
    return []
  }
}
