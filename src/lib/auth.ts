import jwt from 'jsonwebtoken';

/**
 * Sin valor por defecto a propósito: con un secreto quemado en el código,
 * cualquiera que lea el repositorio puede firmarse un token de administrador.
 * Es preferible que la aplicación falle al arrancar a que arranque insegura.
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Por favor define la variable de entorno JWT_SECRET');
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
