import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Product from '../../../lib/models/Product';

// GET /api/products/:id - Obtener producto por ID
export const GET: APIRoute = async ({ params }) => {
  try {
    await connectDB();
    const product = await Product.findOne({ id: params.id });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// PUT /api/products/:id - Actualizar producto (requiere autenticación)
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Verificar autenticación
    const { requireAuth } = await import('../../../lib/middleware/auth');
    const authError = await requireAuth(request);
    if (authError) return authError;

    await connectDB();
    const updates = await request.json();

    const updatedProduct = await Product.findOneAndUpdate(
      { id: params.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return new Response(JSON.stringify({ error: 'Error al actualizar producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// DELETE /api/products/:id - Eliminar producto (requiere autenticación)
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Verificar autenticación
    const { requireAuth } = await import('../../../lib/middleware/auth');
    const authError = await requireAuth(request);
    if (authError) return authError;

    await connectDB();
    const deletedProduct = await Product.findOneAndDelete({ id: params.id });

    if (!deletedProduct) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return new Response(JSON.stringify({ error: 'Error al eliminar producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
