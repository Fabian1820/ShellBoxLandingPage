import type { APIRoute } from 'astro';
import { getAllProducts, addProduct } from '../../../lib/productStore';

// GET /api/products - Obtener todos los productos
export const GET: APIRoute = async () => {
  try {
    const products = getAllProducts();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener productos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// POST /api/products - Crear nuevo producto
export const POST: APIRoute = async ({ request }) => {
  try {
    const productData = await request.json();
    const newProduct = addProduct(productData);

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear producto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
