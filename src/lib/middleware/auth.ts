import { getTokenFromRequest, verifyToken, type TokenPayload } from '../auth';

function json(cuerpo: unknown, status: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Exige un token válido de administrador.
 *
 * Devuelve la respuesta de error si no lo hay, o el payload del token si la
 * petición está autorizada. Quien la llama distingue los dos casos con
 * `instanceof Response`.
 */
export async function requireAuth(request: Request): Promise<Response | TokenPayload> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return json({ error: 'No autorizado — Token requerido' }, 401);
  }

  const payload = verifyToken(token);

  if (!payload) {
    return json({ error: 'No autorizado — Token inválido o expirado' }, 401);
  }

  // El rol se comprueba aquí y no solo al iniciar sesión: un token viejo de una
  // cuenta degradada no debe seguir teniendo permisos de escritura.
  if (payload.role !== 'admin') {
    return json({ error: 'Prohibido — Se requiere rol de administrador' }, 403);
  }

  return payload;
}
