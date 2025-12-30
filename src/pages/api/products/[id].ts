import type { APIRoute } from 'astro';
import { getProductById, updateProduct, deleteProduct } from '../../../lib/productStore';

// GET /api/products/:id - Obtener producto por ID
export const GET: APIRoute = async ({ params }) => {
  try {
    const product = getProductById(params.id || '');

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
    return new Response(JSON.stringify({ error: 'Error al obtener producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// PUT /api/products/:id - Actualizar producto
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const updates = await request.json();
    const updatedProduct = updateProduct(params.id || '', updates);

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
    return new Response(JSON.stringify({ error: 'Error al actualizar producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// DELETE /api/products/:id - Eliminar producto
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const success = deleteProduct(params.id || '');

    if (!success) {
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
    return new Response(JSON.stringify({ error: 'Error al eliminar producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
