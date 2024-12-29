const prices = [
    { width: 2.90, length: 2.0, price: 40396 },
    { width: 2.90, length: 2.5, price: 46370 },
    { width: 2.90, length: 3.0, price: 52560 },
    { width: 2.90, length: 3.5, price: 58754 },
    { width: 2.90, length: 4.0, price: 64829 },
    { width: 2.90, length: 4.5, price: 71160 },
    { width: 2.90, length: 5.0, price: 77372 },
    { width: 1.50, length: 2.0, price: 24836 },
    { width: 1.50, length: 2.5, price: 27577 },
    { width: 1.50, length: 3.0, price: 30672 },
    { width: 1.50, length: 3.5, price: 33769 },
    { width: 1.50, length: 4.0, price: 36807 },
    { width: 1.50, length: 4.5, price: 39972 },
    { width: 1.50, length: 5.0, price: 43078 },
  ]
  
  const sizeGuides = [
    {
      title: 'Retratos Individuales',
      size: '1.5m × 2.0m',
      description: 'Ideal para fotografía de retrato individual, sentado o de pie',
      image: '/placeholder.svg?height=200&width=150',
    },
    {
      title: 'Parejas',
      size: '1.5m × 2.5m',
      description: 'Perfecto para sesiones de pareja o retratos de dos personas',
      image: '/placeholder.svg?height=200&width=150',
    },
    {
      title: 'Grupos Pequeños',
      size: '2.9m × 3.0m',
      description: 'Óptimo para familias pequeñas o grupos de 3-4 personas',
      image: '/placeholder.svg?height=200&width=150',
    },
    {
      title: 'Grupos Grandes',
      size: '2.9m × 4.0m',
      description: 'Recomendado para familias grandes o grupos numerosos',
      image: '/placeholder.svg?height=200&width=150',
    },
  ]
  
  export default function PriceList() {
    const wideBackdrops = prices.filter(p => p.width === 2.90)
    const standardBackdrops = prices.filter(p => p.width === 1.50)
  
    return (
      <div className="bg-gray-50">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-6 py-6 sm:py-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:gap-x-16 lg:gap-y-6 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:col-span-2">
                Lista de precios y medidas
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1">
                <p className="text-lg leading-8 text-gray-600">
                  Medidas estándar disponibles y sus precios correspondientes. Encuentra el tamaño perfecto para tus necesidades fotográficas.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-white sm:h-16" />
        </div>
  
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          {/* Size Guide Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Guía de Tamaños Recomendados</h3>
            <p className="text-center text-gray-600 mb-8">
              Las imágenes pueden variar según el tamaño del fondo y pueden recortarse. ¡Asegúrate de revisar bien las fotos para el tamaño que realmente vas a comprar!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sizeGuides.map((guide, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                  <div className="w-40 h-40 bg-violet-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-violet-600">
                      <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{guide.title}</h4>
                  <p className="text-rose-600 font-medium mb-2">{guide.size}</p>
                  <p className="text-gray-600 text-sm">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Pricing Section */}
          <div className="mt-16 space-y-8">
            {/* Wide Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-rose-50">
                <h3 className="text-xl font-bold text-gray-900">Fondos Anchos (2.90m)</h3>
                <p className="mt-1 text-sm text-gray-500">Ideales para grupos y familias</p>
              </div>
              <div className="divide-y divide-gray-200">
                {wideBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Standard Backdrops */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-violet-50">
                <h3 className="text-xl font-bold text-gray-900">Fondos Estándar (1.50m)</h3>
                <p className="mt-1 text-sm text-gray-500">Perfectos para retratos individuales y parejas</p>
              </div>
              <div className="divide-y divide-gray-200">
                {standardBackdrops.map((item, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.width.toFixed(2)}m × {item.length.toFixed(1)}m
                          </p>
                          <p className="text-sm text-gray-500">
                            Área total: {(item.width * item.length).toFixed(1)}m²
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <div className="mt-16 space-y-6 text-base leading-7 text-gray-600">
            <p>
              El fondo será ajustado y fabricado según las medidas de pared y piso solicitadas.
            </p>
            <p>
              Nuestros fondos fotográficos incluyen pisos si así lo deseas, tenemos 3 propuestas inspiradas en el diseño.
            </p>
            <p>
              Aunque trabajamos con medidas estándar, sabemos lo crucial que es que tu temática se adapte perfectamente a tus espacios.
            </p>
            <p>
              Por eso, ofrecemos la posibilidad de personalizar nuestros fondos fotográficos a la medida de tus necesidades. ¡Indícanos si necesitas una medida personalizada!
            </p>
          </div>
  
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">¿Tienes alguna duda o consulta?</h3>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Escribinos a store@innova54.com
            </p>
          </div>
        </div>
      </div>
    )
  }