import Image from "next/image";
import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-1">
            <p style={{ color: 'var(--ink-soft)' }} className="text-base">
              <b>¿Tenes dudas, consultas o recomendaciones?</b>
              <br />
              Escribirnos a nuestros canales, estamos para atenderte
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--ink-soft)' }}>Redes Sociales</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="https://www.instagram.com/innova54.store" className="hover:text-[#C13584] flex items-center" style={{ color: 'var(--ink-soft)' }}>
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
                    <a href="https://www.facebook.com/innova54.store" className="text-sm hover:text-blue-600 flex items-center" style={{ color: 'var(--ink-soft)' }}>
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
                    <a href="https://www.tiktok.com/@innova54.store" className="text-sm hover:text-blue-600 flex items-center" style={{ color: 'var(--ink-soft)' }}>
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
                    <a href="https://ar.pinterest.com/innova54store/" className="text-sm hover:text-blue-600 flex items-center" style={{ color: 'var(--ink-soft)' }}>
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
              <div className="mt-6 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--ink-soft)' }}>Contacto</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a
                      href="mailto:store@innova54.com"
                      className="text-sm flex items-center"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" clipRule="evenodd"/>
                      </svg>
                      store@innova54.com
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-sm flex items-center"
                      style={{ color: 'var(--ink-soft)' }}
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
                  <li>
                    <a
                      className="text-sm flex items-center text-left"
                      style={{ color: 'var(--ink-soft)' }}
                      href="https://maps.app.goo.gl/umYECNsdo57obniE6"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        aria-hidden
                        src="svg/google-maps.svg"
                        alt="google maps icon"
                        className="mr-1"
                        width={30}
                        height={30}
                      />
                      Google Maps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base copperplate-condensed-ligth-font" style={{ color: 'var(--ink-faint)' }}>
              &copy; 2025 Innova Tech. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/terminos-y-condiciones" className="text-sm copperplate-condensed-ligth-font" style={{ color: 'var(--ink-soft)' }}>
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
