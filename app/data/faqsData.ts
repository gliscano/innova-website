export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: string 
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

// Mobile-first friendly dataset for FAQs
export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    title: "Generales",
    items: [
      {
        id: "innova",
        question: "¿Qué es Innova?",
        answer:
          "En **Innova Backdrops** nos dedicamos al diseño y fabricación de fondos fotográficos (backdrops), props e insumos para fotógrafos, productores y decoradores de eventos.",
      },
      {
        id: "prices",
        question: "¿Precios y medidas?",
        answer:
          "Consultá todas las opciones y precios actualizados en 👉 {1}",
        link: "https://innova54.com/prices"
      },
      {
        id: "time",
        question: "¿Tiempo de producción?",
        answer:
          "Fondos personalizados: **12 días hábiles** desde el **cierre de pedidos (viernes)**.",
      },
      {
        id: "where",
        question: "¿Dónde están ubicados?",
        answer:
          "Showroom en **Av. San Martín 1777 PB B, Vicente López, Bs. As.** con **turno previo**.",
      },
      {
        id: "shippingAR",
        question: "¿Hacen envíos en Argentina?",
        answer:
          "Sí, a todo el país con **Andreani, OCA, Correo Argentino y Vía Cargo**.",
      },
    ],
  },
  {
    id: "products",
    title: "Fondos y Pisos",
    items: [
      {
        id: "standar_fluo",
        question: "¿Cuál es la diferencia entre fondo estándar y fluo?",
        answer:
          "Los **fondos Fluo** usan tintas fluorescentes que brillan con **luz negra o luces de colores**, creando un efecto neón único. Los **estándar** mantienen tonos naturales, ideales para retratos clásicos.",
      },
      {
        id: "floor",
        question: "¿Fabrican fondos de piso?",
        answer:
          "Sí, fabricamos fondos de piso en material de simil de neoprene, diferentes medidas y diseños.",
      },
      {
        id: "materiales",
        question: "¿De qué material son los backdrops?",
        answer:
          "Fabricados en **tela premium**, no reflejan la luz y evitan arrugas marcadas. Pensados para **uso fotográfico profesional**.",
      },
      {
        id: "limpieza",
        question: "¿Cómo se limpian y almacenan?",
        answer:
          "Podés lavarlos en **ciclo delicado** o limpiarlos con **paño húmedo**. Guardalos **doblados, extendidos o enrollados** sin problema.",
      }, 
    ]   
  },
  {
    id: "pagos",
    title: "Pagos",
    items: [
      {
        id: "wayToPay",
        question: "¿Cómo es la modalidad de pago?",
        answer:
          "Podés abonar con una **seña del 50%** al confirmar tu pedido y el **saldo al momento de la entrega**. Si pagás con **tarjeta de crédito**, el pago es del **100% al confirmar**.",
      },
      {
        id: "metodos",
        question: "¿Qué métodos de pago aceptan?",
        answer:
          "Aceptamos **tarjetas de crédito y débito (1 pago)**, **transferencias bancarias** y **efectivo en nuestro showroom**.",
      },      
    ],
  },
  {
    id: "soporte",
    title: "Soporte",
    items: [
      {
        id: "contacto",
        question: "¿Cómo puedo contactarlos?",
        answer:
          "Escríbenos por WhatsApp y con gusto atenderemos cualquier duda o consulta",
      },
    ],
  },
];


