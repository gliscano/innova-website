export interface StockProduct {
  url: string
  image: string
  name: string
  price: string
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
}

function parseStockProducts(html: string): StockProduct[] {
  const products: StockProduct[] = []

  // Match the product card's own image anchor (class="products-feed__product-link").
  // Empretienda inserts a "10% OFF" badge <span> between the <a> and <img> on some products,
  // so allow that optional span rather than requiring the <img> to follow immediately —
  // but keep the anchor's class scoped so this can't skip past unrelated nav/menu <a> tags.
  const productPattern =
    /<a\s+href="(https:\/\/innova54store\.empretienda\.com\.ar\/productos-en-stock\/[^"]+)"\s+class="products-feed__product-link">(?:\s*<span[^>]*>[\s\S]*?<\/span>)?\s*<img\s[^>]*src="(https:\/\/d22fxaf9t8d39k\.cloudfront\.net\/[^"]+)"[^>]*alt="Producto\s*-\s*([^"]+)"[^>]*\/?>\s*<\/a>/g

  let match
  while ((match = productPattern.exec(html)) !== null) {
    const url = match[1]
    const image = match[2]
    const name = decodeHtmlEntities(match[3].trim())

    // Price lives in a dedicated "products-feed__product-price" block shortly after the card,
    // which may also contain a struck-through <del> original price — take the last $ amount,
    // which is always the current price.
    const remainder = html.slice(match.index + match[0].length, match.index + match[0].length + 1000)
    const priceBlockMatch = remainder.match(/products-feed__product-price[^>]*>([\s\S]*?)<\/p>/)
    const priceSource = priceBlockMatch ? priceBlockMatch[1] : remainder.slice(0, 600)
    const priceMatches = priceSource.match(/\$[\d.,]+/g)
    const price = priceMatches ? priceMatches[priceMatches.length - 1] : ''

    products.push({ url, image, name, price })
  }

  return products
}

export async function getStockProducts(): Promise<StockProduct[]> {
  if (process.env.NODE_ENV !== 'production') return []
  try {
    const res = await fetch('https://innova54store.empretienda.com.ar/productos-en-stock', {
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
