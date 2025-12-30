import type { APIRoute } from 'astro';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token no proporcionado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        user: {
          email: payload.email,
          role: payload.role,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error en verify:', error);
    return new Response(
      JSON.stringify({ error: 'Error al verificar token' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
