import Image from "next/image"

const steps = [
  {
    title: "Paso 1: Recepción de pedido",
    description: "Nuestra fecha de cierre son todos los viernes.",
    image: "/images/innova/Clipboardlist.png",
  },
  {
    title: "Paso 2: Diseño y Fabricación",
    description: "Ajustamos el diseño y el piso a las medidas solicitadas, Luego va a impresión y costura.",
    image: "/images/innova/palette.png",
  },
  {
    title: "Paso 3: Envío",
    description: "Listo para envío por encomienda ó entrega presencial en nuestro estudio (previo acuerdo)",
    image: "/images/innova/truck.png",
  },
]

export default function CustomBackdropProcess() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Necesitas un fondo personalizado?
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Nuestros fondos fotográficos incluyen pisos si así lo deseas, tenemos 3 propuestas inspiradas en el diseño.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <dt className="flex flex-col items-center gap-y-4">
                  <div className="relative h-40 w-40">
                    <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-contain" />
                  </div>
                  <span className="text-lg font-semibold leading-7 text-gray-900">{step.title}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-16 text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Entrega estimada, 10 días hábiles después de la fecha de cierre
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-800">
            Nuestros fondos fotográficos incluyen pisos inspirados en el diseño. Tenemos 3 propuestas para tí.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Ofrecemos la posibilidad de personalizar nuestros fondos fotográficos a la medida de tus necesidades. Conoce
            nuestras medidas. 
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Ver medidas disponibles
          </a>
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Solicitar fondo personalizado
          </a>
        </div>
      </div>
    </section>
  )
}

