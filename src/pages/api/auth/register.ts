import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import Admin from '../../../lib/models/Admin';
import { generateToken } from '../../../lib/auth';

// Esta ruta está solo para crear el primer admin
// Después deberías deshabilitarla o protegerla
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

    // Verificar si el admin ya existe
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ error: 'Este email ya está registrado' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Crear nuevo admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      role: 'admin',
    });

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
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error en register:', error);
    return new Response(
      JSON.stringify({ error: 'Error al registrar admin' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
