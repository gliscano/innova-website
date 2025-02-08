import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <p className="text-gray-600 text-base">
              <b>¿Tenes dudas, consultas o recomendaciones?</b>
              <br />
              Escribirnos a nuestros canales, estamos para atenderte
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Redes Sociales</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="https://www.instagram.com/innova54.store" className="text-gray-600 hover:text-[#C13584] flex items-center">
                      <span className="sr-only">Instagram</span>
                      <Image
                        aria-hidden
                        src="svg/ig.svg"
                        alt="instagram icon"
                        className="mr-2"
                        width={20}
                        height={20}
                      />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/innova54.store" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="sr-only">Facebook</span>
                      <Image
                        aria-hidden
                        src="svg/facebook-icon.svg"
                        alt="facebook icon"
                        className="mr-2"
                        width={20}
                        height={20}
                      />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/innova54.store" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="sr-only">Tiktok</span>
                      <Image
                        aria-hidden
                        src="svg/tiktok-icon.svg"
                        alt="tiktok icon"
                        className="mr-2"
                        width={20}
                        height={20}
                      />
                      Tiktok
                    </a>
                  </li>
                  <li>
                  <a href="https://www.facebook.com/innova54.store" className="text-gray-600 hover:text-blue-600 flex items-center">
                    <span className="sr-only">pinterest</span>
                    <Image
                      aria-hidden
                      src="svg/pinterest-icon.svg"
                      alt="pinterest icon"
                      className="mr-2"
                      width={20}
                      height={20}
                    />
                    Pinterest
                  </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contacto</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900 flex items-center">
                    <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" clipRule="evenodd"/>
                    </svg>
                      store@innova54.com
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-base text-gray-500 hover:text-gray-900 flex items-center"
                      href="https://wa.me/5491171142152"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        aria-hidden
                        src="svg/whatsapp.svg"
                        alt="Whatsapp icon"
                        className="mr-2"
                        width={20}
                        height={20}
                      />
                      Whatsapp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2025 Innova Tech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}