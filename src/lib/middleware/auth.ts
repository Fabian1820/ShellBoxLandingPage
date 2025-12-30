import { getTokenFromRequest, verifyToken } from '../auth';

export async function requireAuth(request: Request): Promise<Response | null> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'No autorizado - Token requerido' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return new Response(
      JSON.stringify({ error: 'No autorizado - Token inválido' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Si llegamos aquí, el usuario está autenticado
  return null;
}
