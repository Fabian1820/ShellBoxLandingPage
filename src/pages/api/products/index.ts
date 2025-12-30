import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Product from '../../../lib/models/Product';

// GET /api/products - Obtener todos los productos
export const GET: APIRoute = async () => {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener productos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// POST /api/products - Crear nuevo producto (requiere autenticación)
export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar autenticación
    const { requireAuth } = await import('../../../lib/middleware/auth');
    const authError = await requireAuth(request);
    if (authError) return authError;

    await connectDB();
    const productData = await request.json();

    // Generar ID único
    const count = await Product.countDocuments();
    const productId = String(count + 1);

    const newProduct = await Product.create({
      ...productData,
      id: productId,
    });

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return new Response(JSON.stringify({ error: 'Error al crear producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
