const CACHE_KEY = 'cards_cache';

/**
 * Retorna a URL direta da imagem da carta (renderização via tag <img> evita erros de CORS)
 */
export function obterUrlImagemCarta(cardId) {
    if (!cardId) return 'https://images.ygoprodeck.com/images/cards/placeholder.jpg';
    return `https://images.ygoprodeck.com/images/cards_small/${cardId}.jpg`;
}

/**
 * Busca na API do YGOProDeck APENAS os IDs que ainda não estão em cache
 * e salva o dicionário atualizado no localStorage.
 */
export async function carregarCartasDoDeck(cardIds) {
    if (!cardIds || cardIds.length === 0) return {};

    // Filtra IDs válidos e remove duplicatas
    const uniqueIds = [...new Set(cardIds.filter(Boolean))];
    
    // Carrega o cache salvo
    const cacheLocal = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const idsFaltantes = uniqueIds.filter(id => !cacheLocal[id]);

    if (idsFaltantes.length > 0) {
        try {
            console.log(`Buscando ${idsFaltantes.length} cartas faltantes na API...`);
            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsFaltantes.join(',')}`;
            
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erro API YGOPRODeck (${res.status})`);
            
            const data = await res.json();

            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(card => {
                    cacheLocal[card.id] = card;
                });
                
                // Grava no localStorage com volume bem abaixo dos 5MB
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheLocal));
            }
        } catch (err) {
            console.error('Erro ao buscar cartas da API:', err);
        }
    }

    return cacheLocal;
}