/**
 * Tipos compartidos entre el servidor y los componentes del cliente.
 *
 * Sustituye al antiguo `productStore.ts`, que además de los tipos guardaba un
 * array de productos de ejemplo en memoria: la web pública leía de ahí y nunca
 * mostraba lo que el panel guardaba en MongoDB.
 */

/** Los nombres de campo son los del esquema de Mongo, para no romper los
 *  productos que ya están guardados. */
export interface Color {
  name: string;
  hex: string;
}

/** Un producto tal y como viaja por la API (documento de Mongo serializado). */
export interface Producto {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: Color[];
  /** Claves del bucket, no URLs. Se resuelven con `urlImagen()`. */
  images: string[];
  featured: boolean;
  new: boolean;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Lo que envía el formulario del panel al crear o editar. */
export type ProductoFormulario = Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>;

export const CATEGORIAS = [
  'Ropa',
  'Calzado',
  'Accesorios',
  'Belleza',
  'Hogar',
  'Deportes',
  'Electrónica',
  'Otros',
] as const;

/**
 * URL pública de una imagen.
 *
 * El bucket es privado, así que las imágenes se sirven a través del proxy de
 * la propia app. Se admite también una URL absoluta por si algún producto
 * antiguo guarda un enlace externo.
 */
export function urlImagen(clave: string | undefined): string {
  if (!clave) return '';
  if (/^https?:\/\//i.test(clave)) return clave;
  return `/api/images/${clave.split('/').map(encodeURIComponent).join('/')}`;
}

/** Primera imagen del producto, o cadena vacía si no tiene ninguna. */
export function imagenPrincipal(producto: Pick<Producto, 'images'>): string {
  return urlImagen(producto.images?.[0]);
}
