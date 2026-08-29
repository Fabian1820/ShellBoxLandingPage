import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Product from '../../../lib/models/Product';
import { requireAuth } from '../../../lib/middleware/auth';

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Identificador legible y único.
 *
 * El código anterior usaba `countDocuments() + 1`: al borrar un producto
 * intermedio, el siguiente reutilizaba un id ya existente y chocaba con el
 * índice único de la colección. Aquí se toma el mayor id numérico en uso y se
 * suma uno, con un reintento por si dos altas simultáneas coinciden.
 */
async function siguienteId(): Promise<string> {
  const productos = await Product.find({}, { id: 1 }).lean<{ id: string }[]>();

  const maximo = productos.reduce((mayor, p) => {
    const n = Number.parseInt(p.id, 10);
    return Number.isFinite(n) && n > mayor ? n : mayor;
  }, 0);

  return String(maximo + 1);
}

/** Deja el cuerpo de la petición en la forma que espera el esquema. */
function normalizar(datos: any) {
  return {
    name: typeof datos.name === 'string' ? datos.name.trim() : '',
    price: Number(datos.price),
    description: typeof datos.description === 'string' ? datos.description.trim() : '',
    category: typeof datos.category === 'string' ? datos.category.trim() : '',
    subcategory: typeof datos.subcategory === 'string' ? datos.subcategory.trim() : '',
    sizes: Array.isArray(datos.sizes) ? datos.sizes.filter(Boolean) : [],
    colors: Array.isArray(datos.colors)
      ? datos.colors.filter((c: any) => c && typeof c.name === 'string' && c.name.trim())
      : [],
    images: Array.isArray(datos.images) ? datos.images.filter(Boolean) : [],
    featured: Boolean(datos.featured),
    new: Boolean(datos.new),
    available: datos.available !== false,
  };
}

// GET /api/products — catálogo público
export const GET: APIRoute = async ({ url }) => {
  try {
    await connectDB();

    const filtro: Record<string, unknown> = {};
    const categoria = url.searchParams.get('category');
    if (categoria) filtro.category = categoria;
    if (url.searchParams.get('available') === 'true') filtro.available = true;

    const productos = await Product.find(filtro).sort({ createdAt: -1 });

    return json(productos, 200);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return json({ error: 'Error al obtener productos' }, 500);
  }
};

// POST /api/products — crear producto (solo admin)
export const POST: APIRoute = async ({ request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  let datos: ReturnType<typeof normalizar>;
  try {
    datos = normalizar(await request.json());
  } catch {
    return json({ error: 'El cuerpo de la petición no es JSON válido' }, 400);
  }

  // Validación explícita: antes un campo obligatorio ausente reventaba en
  // Mongoose y se devolvía un 500 genérico, sin decir qué faltaba.
  const faltan: string[] = [];
  if (!datos.name) faltan.push('nombre');
  if (!datos.description) faltan.push('descripción');
  if (!datos.category) faltan.push('categoría');
  if (!Number.isFinite(datos.price) || datos.price < 0) faltan.push('precio');

  if (faltan.length > 0) {
    return json({ error: `Faltan campos obligatorios: ${faltan.join(', ')}` }, 400);
  }

  try {
    await connectDB();

    // Dos altas simultáneas pueden pedir el mismo id; se reintenta con el
    // siguiente libre en lugar de fallar.
    for (let intento = 0; intento < 3; intento++) {
      try {
        const nuevo = await Product.create({ ...datos, id: await siguienteId() });
        return json(nuevo, 201);
      } catch (error: any) {
        if (error?.code !== 11000 || intento === 2) throw error;
      }
    }

    return json({ error: 'No se pudo asignar un identificador único, inténtalo de nuevo' }, 409);
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      const detalles = Object.values(error.errors ?? {})
        .map((e: any) => e.message)
        .join('. ');
      return json({ error: detalles || 'Datos del producto inválidos' }, 400);
    }

    console.error('Error al crear producto:', error);
    return json({ error: 'Error al crear producto' }, 500);
  }
};
