import Header from '../components/Header'
import Footer from '../components/Footer'
import Gallery from '../components/gallery/Gallery'

export default function GalleryPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const searchTerm = typeof searchParams.searchTerm === 'string'
    ? searchParams.searchTerm
    : undefined

  const rawTags = searchParams.tags
  const tags = typeof rawTags === 'string'
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Gallery 
          searchTerm={searchTerm}
          tags={tags}
          itemsPerPage={100}
          showTags={false}
        />
      </main>
      <Footer />
    </div>
  )
}
