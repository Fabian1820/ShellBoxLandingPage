import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Product from '../../../lib/models/Product';
import { requireAuth } from '../../../lib/middleware/auth';
import { borrarImagen } from '../../../lib/s3';

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Campos que el cliente puede modificar. Cualquier otro se descarta. */
const CAMPOS_EDITABLES = [
  'name',
  'price',
  'description',
  'category',
  'subcategory',
  'sizes',
  'colors',
  'images',
  'featured',
  'new',
  'available',
] as const;

// GET /api/products/:id
export const GET: APIRoute = async ({ params }) => {
  try {
    await connectDB();
    const producto = await Product.findOne({ id: params.id });

    if (!producto) return json({ error: 'Producto no encontrado' }, 404);

    return json(producto, 200);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return json({ error: 'Error al obtener producto' }, 500);
  }
};

// PUT /api/products/:id — actualizar (solo admin)
export const PUT: APIRoute = async ({ params, request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ error: 'El cuerpo de la petición no es JSON válido' }, 400);
  }

  // Lista blanca: sin esto, un cliente podría reescribir el `id` del documento
  // o inyectar campos que el esquema no controla.
  const cambios: Record<string, unknown> = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (campo in cuerpo) cambios[campo] = cuerpo[campo];
  }

  if (typeof cambios.price !== 'undefined') {
    const precio = Number(cambios.price);
    if (!Number.isFinite(precio) || precio < 0) {
      return json({ error: 'El precio no es válido' }, 400);
    }
    cambios.price = precio;
  }

  for (const obligatorio of ['name', 'description', 'category'] as const) {
    if (obligatorio in cambios && !String(cambios[obligatorio] ?? '').trim()) {
      return json({ error: `El campo «${obligatorio}» no puede quedar vacío` }, 400);
    }
  }

  if (Object.keys(cambios).length === 0) {
    return json({ error: 'No se recibió ningún campo modificable' }, 400);
  }

  try {
    await connectDB();

    const actualizado = await Product.findOneAndUpdate(
      { id: params.id },
      { $set: cambios },
      { new: true, runValidators: true }
    );

    if (!actualizado) return json({ error: 'Producto no encontrado' }, 404);

    return json(actualizado, 200);
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      const detalles = Object.values(error.errors ?? {})
        .map((e: any) => e.message)
        .join('. ');
      return json({ error: detalles || 'Datos del producto inválidos' }, 400);
    }

    console.error('Error al actualizar producto:', error);
    return json({ error: 'Error al actualizar producto' }, 500);
  }
};

// DELETE /api/products/:id — eliminar (solo admin)
export const DELETE: APIRoute = async ({ params, request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();
    const eliminado = await Product.findOneAndDelete({ id: params.id });

    if (!eliminado) return json({ error: 'Producto no encontrado' }, 404);

    // Las imágenes quedarían huérfanas ocupando espacio en el bucket. Si el
    // borrado falla no se aborta: el producto ya no existe y eso es lo que
    // pidió el usuario.
    const claves: string[] = eliminado.images ?? [];
    await Promise.allSettled(
      claves
        .filter((clave) => clave.startsWith('products/'))
        .map((clave) => borrarImagen(clave))
    );

    return json({ success: true }, 200);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return json({ error: 'Error al eliminar producto' }, 500);
  }
};
