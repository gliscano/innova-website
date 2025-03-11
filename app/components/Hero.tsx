import Image from 'next/image'
import PhotographyBackdrop from './PhotographyBackdrop'

const backdrops = [
  { 
    id: 0,
    name: 'autos Backdrop',
    image: '/images/innova/hero-1.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 1,
    name: 'Alas Backdrop',
    image: '/images/innova/hero-2.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 2,
    name: 'infantil Backdrop',
    image: '/images/innova/hero-3.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 3,
    name: 'escolar Backdrop',
    image: '/images/innova/hero-4.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 4,
    name: 'Grunge Backdrop',
    image: '/images/innova/hero-5.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 5,
    name: 'escolar infantil Backdrop',
    image: '/images/innova/hero-6.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 6,
    name: 'escolar Backdrop',
    image: '/images/innova/hero-7.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 7,
    name: 'infantil Backdrop',
    image: '/images/innova/hero-8.png',
    title: '',
    subtitle: ''
  },
  { 
    id: 8,
    name: 'paredes Backdrop',
    image: '/images/innova/hero-9.png',
    title: '',
    subtitle: ''
  },
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96" />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-2 pt-6 lg:pt-12 lg:pb-12 lg:flex lg:px-8 lg:py-8">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-4">
          <h1 className="mt-4 pr-4 text-3xl copperplate-bold-font font-bold text-gray-900 sm:text-5xl">
            Crea y captura con una experiencia superior
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Personalización, calidad y detalle en cada insumo fotográfico.
          </p>
          <div className="flex space-x-4 pt-4">
            <div className="flex justify-center items-center space-x-4 md:order-2">
              <a
                href="https://www.instagram.com/innova54.store"
                className="text-gray-600 hover:text-[#C13584]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/innova54.store"
                className="text-gray-600 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                className="rounded-full border border-solid border-black/[.145] dark:border-white/[.145] text-gray-800 transition-colors flex items-center justify-center hover:bg-[#25d366] dark:hover:bg-[#25d366] hover:border-transparent text-sm sm:h-8 sm:px-5 sm:min-w-42"
                href="https://wa.me/5491171142152"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="svg/phone.svg"
                  alt="Whatsapp icon"
                  className="mr-2"
                  width={16}
                  height={16}
                />
                Escribir a Whatsapp
              </a>
            </div>
          </div>
        </div>
        <div className="relative w-full h-[11rem] md:h-[18rem] lg:h-[18rem] my-4 lg:my-4 overflow-hidden rounded-lg">
          <PhotographyBackdrop backdrops={backdrops} showPreview={false} />
        </div>
      </div>
    </div>
  )
}

