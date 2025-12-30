import mongoose from 'mongoose';
import Admin from '../src/lib/models/Admin';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:hzuuHULbDyWKQaStnypoJtmWitOaOYmX@gondola.proxy.rlwy.net:49572/shellbox';

async function initAdmin() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    console.log('📍 URL:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Ocultar contraseña en logs

    await mongoose.connect(MONGODB_URI, {
      authSource: 'admin', // Especificar que las credenciales están en la DB admin
    });
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await Admin.findOne({ email: 'admin@shellbox.com' });

    if (existingAdmin) {
      console.log('⚠️  Ya existe un admin con el email admin@shellbox.com');
      console.log('💡 Si deseas crear uno nuevo, elimina el existente primero');
      process.exit(0);
    }

    // Crear nuevo admin
    const admin = await Admin.create({
      email: 'admin@shellbox.com',
      password: 'admin123', // La contraseña se encripta automáticamente en el modelo
      role: 'admin',
    });

    console.log('');
    console.log('✅ Usuario admin creado exitosamente!');
    console.log('');
    console.log('📧 Email: admin@shellbox.com');
    console.log('🔑 Contraseña: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
    console.log('');

    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initAdmin();
