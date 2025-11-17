export const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="relative">
      <div className="w-full h-24 bg-gray-200 mt-1"></div>
      <div className="absolute top-2 right-2 w-6 h-6 bg-gray-300 rounded-3xl"></div>
    </div>
    <div className="px-4 pb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
)

export const ProductGridSkeleton = () => (
  <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
)

