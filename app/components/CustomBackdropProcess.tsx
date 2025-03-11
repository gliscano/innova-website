"use client"

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

const steps = [
  {
    title: "Paso 1: Recepción de pedido",
    description: "Decinos el diseño que te gusta y las medidas. Nuestra fecha de cierre de pedidos son todos los viernes.",
    animation: "/animations/customer-services.json"
  },
  {
    title: "Paso 2: Diseño y Fabricación",
    description: "Confirmada la seña, ajustamos el diseño a las medidas solicitadas y te enviamos 3 propuestas para el piso. Luego va a impresión y costura.",
    animation: "/animations/design.json"
  },
  {
    title: "Paso 3: Envío",
    description: "Listo para envío por encomienda ó entrega presencial en nuestro estudio (previo acuerdo)",
    animation: "/animations/shipping.json"
  },
]

export default function CustomBackdropProcess() {
  const animationRef = useRef<React.RefObject<HTMLDivElement>>(null)
  const animationStepRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    animationRef.current =
      lottie.loadAnimation({
        container: document.getElementById('animated-lottie-custom-backdrop'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/steps.json',
      })

      animationStepRefs.current.forEach((ref, index) => {
        if (ref) {
          lottie.loadAnimation({
            container: ref,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: steps[index].animation,
          })
        }
      })
  }, [])

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-6 lg:pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-6 py-6 sm:py-6 lg:px-8 flex justify-around">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:gap-x-16 lg:gap-y-6 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-xl copperplate-bold-font tracking-tight text-gray-900 sm:text-5xl lg:col-span-2">
                ¿Necesitas un fondo personalizado?
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1">
                <p className="text-medium lg:text-lg leading-8 text-gray-600">
                  Elevá tu creatividad sin límites y tenelo en 10 días hábiles. Conocé los pasos...
                </p>
              </div>
            </div>
            <div
                ref={animationRef}
                id='animated-lottie-custom-backdrop'
                className="h-36 py-2"
              ></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-white sm:h-16" />
        </div>
        <div className="flex justify-center mt-12 max-w-2xl lg:mt-24 lg:max-w-none md:mx-auto">
          <dl className="grid grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none md:grid-cols-3 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <dt className="flex flex-col items-center gap-y-4">
                  <div className="relative h-40 w-40">
                  <div
                    ref={(el) => ((animationStepRefs.current[index] = el) as typeof  HTMLDivElement)}
                    className="h-36 px-2"
                  ></div>
                  </div>
                  <span className="text-lg font-semibold leading-7 text-gray-900">{step.title}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-700">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-10 mb-10 flex items-center justify-center gap-x-6">
          <a href="/prices" className="text-sm font-semibold leading-6 text-gray-900">
            Ver medidas disponibles
          </a>
          <a
            href="https://wa.me/5491171142152"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Solicitar fondo personalizado
          </a>
        </div>
      </div>
    </section>
  )
}

