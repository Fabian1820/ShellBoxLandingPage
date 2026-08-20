import mongoose from 'mongoose';
import Admin from '../src/lib/models/Admin';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function initAdmin() {
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Faltan variables de entorno: MONGODB_URI, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias');
    process.exit(1);
  }

  try {
    console.log('🔌 Conectando a MongoDB...');
    console.log('📍 URL:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Ocultar contraseña en logs

    await mongoose.connect(MONGODB_URI, {
      authSource: 'admin', // Especificar que las credenciales están en la DB admin
    });
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`⚠️  Ya existe un admin con el email ${ADMIN_EMAIL}`);
      console.log('💡 Si deseas crear uno nuevo, elimina el existente primero');
      process.exit(0);
    }

    // Crear nuevo admin
    await Admin.create({
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD, // La contraseña se encripta automáticamente en el modelo
      role: 'admin',
    });

    console.log('');
    console.log(`✅ Usuario admin creado exitosamente: ${ADMIN_EMAIL}`);
    console.log('');

    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initAdmin();
