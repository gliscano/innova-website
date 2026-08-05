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
  const seen = new Set<string>()

  // Each product is one `products-feed__product` card. Inside it, Empretienda renders a
  // preview carousel with one <a class="products-feed__product-link"> per gallery image —
  // all pointing at the same product URL — so parsing per-image would yield N cards per
  // product. Split by card first, then take a single image from each.
  // The trailing \s in the class match keeps `products-feed__products` (the grid container)
  // and `products-feed__product-wrapper` from being treated as cards.
  const cards = html.split(/<div\s+class="products-feed__product\s/).slice(1)

  for (const card of cards) {
    const urlMatch = card.match(
      /<a\s+href="(https:\/\/innova54store\.empretienda\.com\.ar\/productos-en-stock\/[^"]+)"\s+class="products-feed__product-link"/
    )
    if (!urlMatch) continue
    const url = urlMatch[1]

    // Skip duplicates in case the feed repeats a product across sections.
    if (seen.has(url)) continue

    // First carousel image is the product's cover (the `is-active` slide).
    const imageMatch = card.match(
      /<img\s[^>]*class="products-feed__product-image"[^>]*src="(https:\/\/d22fxaf9t8d39k\.cloudfront\.net\/[^"]+)"/
    )
    if (!imageMatch) continue
    const image = imageMatch[1]

    // Prefer the card's own name heading — the <img alt> carries a " - 0" gallery index suffix.
    const nameMatch = card.match(
      /products-feed__product-name[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/
    )
    const altMatch = card.match(/<img\s[^>]*alt="Producto\s*-\s*([^"]+?)(?:\s*-\s*\d+)?"/)
    const rawName = nameMatch?.[1] ?? altMatch?.[1] ?? ''
    const name = decodeHtmlEntities(rawName.replace(/\s+/g, ' ').trim())
    if (!name) continue

    // Price lives in a dedicated "products-feed__product-price" block, which may also contain
    // a struck-through <del> original price — take the last $ amount, which is the current one.
    const priceBlockMatch = card.match(/products-feed__product-price[^>]*>([\s\S]*?)<\/p>/)
    const priceMatches = priceBlockMatch ? priceBlockMatch[1].match(/\$[\d.,]+/g) : null
    const price = priceMatches ? priceMatches[priceMatches.length - 1] : ''

    seen.add(url)
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
