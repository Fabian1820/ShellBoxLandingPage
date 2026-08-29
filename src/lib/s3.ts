import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

/**
 * Acceso al bucket de imágenes de productos.
 *
 * El bucket es privado: nada de aquí se sirve directamente al navegador. Las
 * imágenes salen por `/api/images/[...clave]`, que las lee con estas mismas
 * credenciales y las cachea.
 */

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const ENDPOINT = process.env.AWS_ENDPOINT_URL;
const REGION = process.env.AWS_DEFAULT_REGION || 'auto';

let cliente: S3Client | null = null;

/** `null` si el almacenamiento no está configurado, para poder avisar con claridad. */
export function clienteS3(): S3Client | null {
  if (!BUCKET || !ENDPOINT || !process.env.AWS_ACCESS_KEY_ID) return null;

  cliente ??= new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    // Los endpoints compatibles con S3 (Tigris, MinIO, R2) esperan la clave en
    // la ruta, no en el subdominio.
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  return cliente;
}

export function almacenamientoConfigurado(): boolean {
  return clienteS3() !== null;
}

export const TIPOS_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const;

export const TAMANO_MAXIMO = 8 * 1024 * 1024; // 8 MB

/**
 * Normaliza el nombre del fichero: sin acentos, sin espacios y sin caracteres
 * que compliquen la URL. El prefijo aleatorio evita colisiones entre subidas
 * simultáneas del mismo nombre.
 */
export function claveParaArchivo(nombreOriginal: string): string {
  const punto = nombreOriginal.lastIndexOf('.');
  const extension = punto > -1 ? nombreOriginal.slice(punto + 1).toLowerCase() : 'jpg';
  const base = (punto > -1 ? nombreOriginal.slice(0, punto) : nombreOriginal)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);

  const sufijo = Math.random().toString(36).slice(2, 10);
  return `products/${Date.now()}-${sufijo}-${base || 'imagen'}.${extension}`;
}

export async function subirImagen(
  clave: string,
  cuerpo: Uint8Array,
  contentType: string
): Promise<void> {
  const s3 = clienteS3();
  if (!s3) throw new Error('Almacenamiento de imágenes no configurado');

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: clave,
      Body: cuerpo,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

export async function obtenerImagen(clave: string) {
  const s3 = clienteS3();
  if (!s3) throw new Error('Almacenamiento de imágenes no configurado');

  return s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: clave }));
}

export async function borrarImagen(clave: string): Promise<void> {
  const s3 = clienteS3();
  if (!s3) return;

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: clave }));
}
