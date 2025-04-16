export const generateCartLink = (produtos: any | any[]): string => {
  // Verifica se foi enviado apenas um produto ou uma lista de produtos
  if (Array.isArray(produtos)) {
    // Se for uma lista, cria o link com todos os produtos
    const produtosString = produtos.map(p => `${p.quantidade} de ${p.produto}`).join(", ");
    return `http://seusite.com/carrinho?produtos=${encodeURIComponent(produtosString)}`;
  } else {
    // Se for um único produto, cria o link com o id e nome do produto
    return `http://loja.com.br/carrinho?produto_id=${produtos.id}&produto_nome=${produtos.name}`;
  }
};
