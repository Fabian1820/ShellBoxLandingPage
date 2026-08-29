import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/middleware/auth';
import {
  almacenamientoConfigurado,
  claveParaArchivo,
  subirImagen,
  TAMANO_MAXIMO,
  TIPOS_PERMITIDOS,
} from '../../lib/s3';

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST /api/upload — sube una o varias imágenes al bucket (solo admin).
 *
 * Devuelve las claves, no URLs: es lo que se guarda en el producto y lo que
 * luego resuelve `/api/images/[...clave]`.
 */
export const POST: APIRoute = async ({ request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  if (!almacenamientoConfigurado()) {
    return json(
      {
        error:
          'El almacenamiento de imágenes no está configurado. Faltan las variables AWS_S3_BUCKET_NAME, AWS_ENDPOINT_URL o AWS_ACCESS_KEY_ID.',
      },
      503
    );
  }

  let formulario: FormData;
  try {
    formulario = await request.formData();
  } catch {
    return json({ error: 'Se esperaba un formulario multipart con el campo "files"' }, 400);
  }

  const archivos = formulario.getAll('files').filter((f): f is File => f instanceof File);

  if (archivos.length === 0) {
    return json({ error: 'No se recibió ninguna imagen' }, 400);
  }

  if (archivos.length > 8) {
    return json({ error: 'Máximo 8 imágenes por producto' }, 400);
  }

  // Se valida todo antes de subir nada, para no dejar imágenes sueltas en el
  // bucket si una del lote no cumple.
  for (const archivo of archivos) {
    if (!TIPOS_PERMITIDOS.includes(archivo.type as (typeof TIPOS_PERMITIDOS)[number])) {
      return json(
        { error: `Formato no admitido: ${archivo.type || 'desconocido'} (${archivo.name})` },
        415
      );
    }
    if (archivo.size > TAMANO_MAXIMO) {
      return json(
        {
          error: `«${archivo.name}» pesa ${(archivo.size / 1024 / 1024).toFixed(1)} MB. El máximo es ${TAMANO_MAXIMO / 1024 / 1024} MB.`,
        },
        413
      );
    }
    if (archivo.size === 0) {
      return json({ error: `«${archivo.name}» está vacío` }, 400);
    }
  }

  try {
    const claves = await Promise.all(
      archivos.map(async (archivo) => {
        const clave = claveParaArchivo(archivo.name);
        const contenido = new Uint8Array(await archivo.arrayBuffer());
        await subirImagen(clave, contenido, archivo.type);
        return clave;
      })
    );

    return json({ keys: claves }, 201);
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    return json({ error: 'No se pudieron subir las imágenes' }, 500);
  }
};
