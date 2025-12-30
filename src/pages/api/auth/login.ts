import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Admin from '../../../lib/models/Admin';
import { generateToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email y contraseña son requeridos' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Buscar admin por email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar contraseña
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generar token
    const token = generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: {
          email: admin.email,
          role: admin.role,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: 'Error al iniciar sesión' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
