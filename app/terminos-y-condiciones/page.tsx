// import { Shield, DollarSign, Clock, Calendar, Banknote, Award, Palette, ImageIcon } from "lucide-react"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"

const sections = [
  {
    id: "uso-marca",
    title: "Uso de la marca Innova",
    // icon: Shield,
    content:
      'La marca "Innova" y todos sus productos y servicios están protegidos por derechos de propiedad intelectual. Queda expresamente prohibido el uso, reproducción, oferta, promoción o comercialización de productos y/o servicios de Innova sin la autorización previa, expresa y por escrito de sus representantes. Innova no cuenta con terceros habilitados para actuar en representación de la marca.',
  },
  {
    id: "precios",
    title: "Precios",
    // icon: DollarSign,
    content:
      "Los precios de nuestros productos y servicios están sujetos a modificación sin previo aviso. No obstante, Innova se compromete a mantener las condiciones pactadas con los clientes que ya hayan iniciado un proceso de compra, incluyendo señas o pagos parciales.",
  },
  {
    id: "tiempos-entrega",
    title: "Tiempos de entrega",
    // icon: Clock,
    content:
      "Los tiempos de entrega estimados son informados al momento de la compra y pueden variar según la demanda, características del producto y método de envío o retiro seleccionado. Innova no se hace responsable por devoluciones de pagos en caso de demoras, siempre y cuando dichas demoras sean informadas oportunamente al cliente.",
  },
  {
    id: "tiempo-retiro",
    title: "Tiempo para retirar los productos",
    // icon: Calendar,
    content:
      "Una vez que el cliente sea notificado de que su producto está listo para ser retirado, contará con un plazo máximo de quince (15) días corridos para efectuar el retiro. Pasado este período, el producto pasará nuevamente a stock disponible para la venta y el cliente perderá el monto abonado por concepto de seña. Esta cláusula podrá ser revisada únicamente si el cliente mantiene contacto con Innova dentro del plazo establecido y justifica una causa mayor que impida el retiro en tiempo y forma.",
  },
  {
    id: "origen-fondos",
    title: "Origen de los fondos",
    // icon: Banknote,
    content:
      "El cliente declara que los fondos utilizados para realizar cualquier operación con Innova provienen de actividades lícitas y están debidamente justificados conforme a las normativas legales vigentes. Innova se reserva el derecho de requerir información adicional sobre el origen del dinero si lo considera necesario.",
  },
  {
    id: "garantia",
    title: "Garantía",
    // icon: Award,
    content:
      "Todos los productos de Innova son revisados antes de ser entregados. La garantía cubre únicamente defectos de fabricación. Cualquier defecto debe ser informado por el cliente dentro de las primeras veinticuatro (24) horas posteriores a la entrega o retiro del producto. Vencido este plazo, se considerará que el producto fue recibido en condiciones óptimas. La garantía no aplica sobre daños ocasionados por mal uso, manipulación incorrecta, humedad, golpes, desgaste por uso normal u otros factores externos. Para hacer uso de la garantía, el cliente deberá presentar el comprobante de compra correspondiente.",
  },
  {
    id: "propiedad-disenos",
    title: "Propiedad de los diseños",
    // icon: Palette,
    content:
      "Todos los diseños desarrollados por Innova, ya sean físicos o digitales, son propiedad intelectual de la empresa. No está permitida su reproducción, modificación ni uso con fines comerciales sin la autorización expresa de Innova. En el caso de trabajos personalizados, Innova se reserva el derecho de conservar copia del diseño en su portafolio, salvo que el cliente indique lo contrario de forma expresa.",
  },
  {
    id: "uso-imagenes",
    title: "Uso de imágenes y privacidad",
    // icon: ImageIcon,
    content:
      "Innova podrá utilizar imágenes de productos terminados y montajes realizados para promoción en sus redes sociales, sitio web o material publicitario. En caso de que dichas imágenes incluyan personas identificables, se solicitará la debida autorización del cliente. La información personal proporcionada por los clientes será tratada de forma confidencial y no será compartida con terceros, salvo obligación legal o autorización expresa del titular.",
  },
]

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Términos y Condiciones</h2>
              <p className="mt-4 text-lg text-gray-500">
                Información importante sobre nuestras políticas y procedimientos.
              </p>
              <div className="mt-6 space-y-4">
                <nav className="space-y-1 sticky top-20">
                  {sections.map((section) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                    >
                      <section.icon className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400" />
                      <span className="truncate">{section.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <div className="space-y-12">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-20">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex items-center">
                        {/* <section.icon className="flex-shrink-0 mr-3 h-6 w-6 text-indigo-600" /> */}
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{section.title}</h3>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}