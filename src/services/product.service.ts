export const getProductById = (id: number) => {
    const products = [
      { id: 1, name: 'Buquê de Rosas Vermelhas' },
      { id: 2, name: 'Cesta de Café da Manhã' },
      { id: 3, name: 'Arranjo de Flores Coloridas' },
    ];
  
    return products.find(product => product.id === id);
  };
  