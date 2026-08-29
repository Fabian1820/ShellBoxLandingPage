import type { APIRoute } from 'astro';
import { obtenerImagen } from '../../../lib/s3';

/**
 * GET /api/images/<clave> — sirve una imagen del bucket privado.
 *
 * El bucket no es público, así que las imágenes de los productos pasan por
 * aquí. La respuesta se cachea de forma agresiva porque las claves llevan
 * marca de tiempo: una imagen nunca cambia de contenido bajo la misma clave.
 */
export const GET: APIRoute = async ({ params, request }) => {
  const clave = params.clave;

  if (!clave) {
    return new Response('Falta la clave de la imagen', { status: 400 });
  }

  // Solo se sirven imágenes de productos: evita que la ruta se convierta en un
  // lector genérico del bucket.
  if (!clave.startsWith('products/') || clave.includes('..')) {
    return new Response('No encontrada', { status: 404 });
  }

  try {
    const objeto = await obtenerImagen(clave);

    if (!objeto.Body) {
      return new Response('No encontrada', { status: 404 });
    }

    // Si el navegador ya la tiene, se responde 304 y no se transfiere nada.
    const etag = objeto.ETag;
    if (etag && request.headers.get('if-none-match') === etag) {
      return new Response(null, { status: 304, headers: { ETag: etag } });
    }

    const cabeceras = new Headers({
      'Content-Type': objeto.ContentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    if (etag) cabeceras.set('ETag', etag);
    if (objeto.ContentLength) cabeceras.set('Content-Length', String(objeto.ContentLength));

    return new Response(objeto.Body.transformToWebStream(), { status: 200, headers: cabeceras });
  } catch (error: any) {
    const codigo = error?.name || error?.Code;
    if (codigo === 'NoSuchKey' || codigo === 'NotFound' || error?.$metadata?.httpStatusCode === 404) {
      return new Response('No encontrada', { status: 404 });
    }

    console.error('Error al servir la imagen:', clave, error);
    return new Response('Error al obtener la imagen', { status: 500 });
  }
};
