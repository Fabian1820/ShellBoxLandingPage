/**
 * Configuración del negocio: fuente única de verdad.
 *
 * Todo el copy de tarifas, tiempos y contacto sale de aquí. Si cambian las
 * reglas del negocio, se toca este archivo y no las secciones de la web.
 */

export const CONTACTO = {
  whatsapp: '5356844243',
  whatsappDisplay: '+53 5 684 4243',
  canalWhatsapp: 'https://whatsapp.com/channel/0029Vb7uvLt4o7qO1HnG1B2u',
  instagram: 'https://www.instagram.com/shellboxencargos/',
  instagramHandle: '@shellboxencargos',
} as const;

/** Abre WhatsApp con un mensaje prellenado. */
export function whatsappLink(mensaje: string): string {
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export const TARIFAS = [
  {
    id: 'miscelanea',
    nombre: 'Miscelánea',
    precio: 6,
    unidad: 'USD / libra',
    entrega: '5 a 7 días',
    descripcion:
      'Ropa, calzado, accesorios, cosméticos y artículos personales de tamaño normal.',
    destacada: true,
  },
  {
    id: 'carga',
    nombre: 'Carga y sobredimensionado',
    precio: 3,
    unidad: 'USD / libra',
    entrega: '40 a 45 días',
    descripcion:
      'Electrodomésticos, muebles, piezas y todo lo que por volumen o peso no entra como miscelánea.',
    destacada: false,
  },
] as const;

export const PASOS = [
  {
    numero: '01',
    titulo: 'Prepara tu carrito',
    descripcion:
      'Compra en cualquier tienda de Estados Unidos: Amazon, Walmart, Temu, Shein, Fashion Nova… Si la tienda envía a EEUU, nosotros lo traemos.',
  },
  {
    numero: '02',
    titulo: 'Envíanos el enlace',
    descripcion:
      'Mándanos por WhatsApp el enlace del producto o el carrito completo y te decimos el costo exacto antes de comprar.',
  },
  {
    numero: '03',
    titulo: 'Nosotros compramos',
    descripcion:
      'Hacemos la compra, recibimos la mercancía en nuestro almacén de Estados Unidos y la preparamos para el envío.',
  },
  {
    numero: '04',
    titulo: 'Recoges y pagas en Cuba',
    descripcion:
      'Te avisamos por WhatsApp cuando llegue. Recoges en El Vedado, La Habana, y pagas solo cuando tienes tu mercancía en la mano.',
  },
] as const;

/**
 * Tiendas de las que recogemos encargos.
 *
 * `color` es el color corporativo de cada marca y `slug` el nombre del archivo
 * que se busca en `public/tiendas/<slug>.svg`. Si ese archivo existe se pinta
 * el logotipo; si no, se muestra el nombre con el color de la marca. Así la web
 * no incluye material de marca de terceros salvo que se añada a propósito.
 */
export const TIENDAS = [
  { nombre: 'Amazon', slug: 'amazon', color: '#FF9900' },
  { nombre: 'Walmart', slug: 'walmart', color: '#0071DC' },
  { nombre: 'Shein', slug: 'shein', color: '#000000', colorOscuro: '#FFFFFF' },
  { nombre: 'Temu', slug: 'temu', color: '#FB7701' },
  { nombre: 'Fashion Nova', slug: 'fashion-nova', color: '#000000', colorOscuro: '#FFFFFF' },
  { nombre: 'eBay', slug: 'ebay', color: '#E53238' },
  { nombre: 'Target', slug: 'target', color: '#CC0000' },
  { nombre: 'Best Buy', slug: 'best-buy', color: '#0046BE' },
  { nombre: 'Nike', slug: 'nike', color: '#111111', colorOscuro: '#FFFFFF' },
  { nombre: 'Zara', slug: 'zara', color: '#000000', colorOscuro: '#FFFFFF' },
  { nombre: 'AliExpress', slug: 'aliexpress', color: '#FF4747' },
  { nombre: 'Home Depot', slug: 'home-depot', color: '#F96302' },
  { nombre: 'Sephora', slug: 'sephora', color: '#000000', colorOscuro: '#FFFFFF' },
  { nombre: 'Victoria\u2019s Secret', slug: 'victorias-secret', color: '#D6006F' },
] as const;

export const VENTAJAS = [
  {
    icono: 'transparencia',
    titulo: 'Transparencia',
    descripcion:
      'Te decimos el costo exacto antes de comprar, no cuando la mercancía ya está en Cuba. Sin sorpresas al final.',
  },
  {
    icono: 'seguridad',
    titulo: 'Seguridad',
    descripcion:
      'Pagas únicamente cuando recibes tu mercancía en Cuba. Si un paquete se pierde por nuestra responsabilidad, lo reembolsamos.',
  },
  {
    icono: 'asesoramiento',
    titulo: 'Asesoramiento',
    descripcion:
      'Te acompañamos en todo el proceso: qué se puede traer, cuánto va a pesar y cómo aprovechar mejor cada envío.',
  },
  {
    icono: 'diversidad',
    titulo: 'Diversidad',
    descripcion:
      'No dependes de una sola tienda. Recogemos encargos de cualquier tienda que tenga envío a Estados Unidos.',
  },
] as const;

export const PAGO = {
  momento: 'Al recibir la mercancía en Cuba',
  moneda: 'USD',
  metodos: ['Efectivo', 'Zelle'],
  nota: 'En efectivo solo se aceptan billetes de 20 USD o denominaciones superiores.',
} as const;

export const ENTREGA = {
  lugar: 'El Vedado, La Habana',
  plazoRecogida: '7 días hábiles',
  aviso: 'Grupo oficial de WhatsApp',
} as const;

export const FAQS = [
  {
    pregunta: '¿De qué tiendas pueden traer mis compras?',
    respuesta:
      'De cualquier tienda que tenga envío dentro de Estados Unidos. Amazon, Walmart, Shein, Temu, Fashion Nova, eBay y muchas más. Si tienes dudas con una tienda concreta, escríbenos y lo confirmamos.',
  },
  {
    pregunta: '¿Cómo sé cuánto me va a costar?',
    respuesta:
      'Nos envías el enlace del producto o el carrito preparado y te damos el costo antes de que se compre nada. La miscelánea va a 6 USD por libra y la carga o mercancía sobredimensionada a 3 USD por libra.',
  },
  {
    pregunta: '¿Cuándo pago?',
    respuesta:
      'Cuando recibes tu mercancía en Cuba, nunca antes. El pago es en USD, en efectivo (billetes de 20 o superiores) o por Zelle.',
  },
  {
    pregunta: '¿Cuánto demora?',
    respuesta:
      'La miscelánea llega en 5 a 7 días desde que entra al almacén. La carga y la mercancía sobredimensionada demoran de 40 a 45 días. Son tiempos estimados y pueden variar por factores externos.',
  },
  {
    pregunta: '¿Cómo compran en Shein, Temu o Fashion Nova?',
    respuesta:
      'En Amazon, Walmart y tiendas similares basta con el enlace del producto. En plataformas como Shein, Temu o Fashion Nova necesitamos acceder a tu cuenta con el carrito ya preparado para efectuar el pago; usamos el acceso únicamente para eso.',
  },
  {
    pregunta: '¿Hay productos que no puedan traer?',
    respuesta:
      'No aceptamos equipos WiFi ni de telecomunicaciones restringidos, ni ningún artículo prohibido por la Aduana General de Cuba. Verifica siempre que tu producto esté permitido antes de comprar.',
  },
  {
    pregunta: '¿Dónde recojo mi paquete?',
    respuesta:
      'En El Vedado, La Habana. Te avisamos por WhatsApp cuando tu mercancía llegue y tienes 7 días hábiles para recogerla.',
  },
  {
    pregunta: '¿Qué pasa si el producto llega defectuoso o equivocado?',
    respuesta:
      'La mercancía viaja tal y como la recibimos del proveedor: no abrimos ni probamos los paquetes. Cualquier reclamación por talla, modelo, color o defecto de fábrica se gestiona directamente con la tienda donde se compró.',
  },
] as const;
