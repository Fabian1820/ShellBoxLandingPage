// Store simple para productos - En el futuro conectar con MongoDB
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

// Productos de ejemplo en memoria
let products: Product[] = [
  {
    id: 'P001',
    name: 'Vestido de Verano Floral',
    price: 25.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
    category: 'Ropa',
    available: true,
  },
  {
    id: 'P002',
    name: 'Blusa Elegante Blanca',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500&h=500&fit=crop',
    category: 'Ropa',
    available: true,
  },
  {
    id: 'P003',
    name: 'Conjunto Deportivo',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
    category: 'Deportes',
    available: false,
  },
  {
    id: 'P004',
    name: 'Zapatos Casuales',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
    category: 'Calzado',
    available: true,
  },
  {
    id: 'P005',
    name: 'Bolso de Mano Elegante',
    price: 28.75,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop',
    category: 'Accesorios',
    available: true,
  },
  {
    id: 'P006',
    name: 'Jeans Modernos',
    price: 38.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    category: 'Ropa',
    available: true,
  },
];

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const newProduct: Product = {
    ...product,
    id: `P${String(products.length + 1).padStart(3, '0')}`,
  };
  products.push(newProduct);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}
