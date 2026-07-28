const LOCAL_STORAGE_KEY = 'ygo_cartas_banco_v1';
const IMAGE_CACHE_NAME = 'ygo-card-images-v1';

function otimizarCartas(cartasBrutas) {
    return cartasBrutas.map(carta => {
        let valorEscala = carta.level ?? 0;
        let tipoEscala = 'LV';
        const tipoCarta = carta.frameType || "";

        if (tipoCarta.includes('xyz')) {
            tipoEscala = 'RK';
        } else if (carta.linkval !== undefined && carta.linkval !== null) {
            valorEscala = carta.linkval;
            tipoEscala = 'LK';
        }

        return {
            id: carta.id,
            name: carta.name,
            type: carta.type,
            desc: carta.desc || "",
            attribute: carta.attribute || "",
            race: carta.race || "",
            archetype: carta.archetype || "",
            level: valorEscala,
            levelType: tipoEscala,
            image: carta.card_images?.[0]?.image_url_small || ""
        };
    });
}

export async function buscarBanco() {
    const dadosLocais = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (dadosLocais) {
        console.log("Servindo cartas diretamente do LocalStorage do celular.");
        return JSON.parse(dadosLocais);
    }

    console.log("Baixando banco de cartas pela primeira vez...");
    return await sincronizarBanco();
}

export async function sincronizarBanco() {
    try {
        const resposta = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
        if (!resposta.ok) throw new Error(`Erro na API externa: ${resposta.status}`);

        const dados = await resposta.json();
        if (!dados || !dados.data || !Array.isArray(dados.data)) {
            throw new Error("Formato de dados inválido.");
        }

        const cartasOtimizadas = otimizarCartas(dados.data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartasOtimizadas));
        return cartasOtimizadas;
    } catch (erro) {
        console.error("Erro ao sincronizar banco de cartas:", erro);
        throw erro;
    }
}

export async function obterUrlImagemCarta(id) {
    if (!id || !/^\d+$/.test(id)) {
        return 'https://images.ygoprodeck.com/images/cards/placeholder.jpg';
    }

    const remoteUrl = `https://images.ygoprodeck.com/images/cards_small/${id}.jpg`;

    if (!('caches' in window)) {
        return remoteUrl;
    }

    try {
        const cache = await caches.open(IMAGE_CACHE_NAME);
        const cachedResponse = await cache.match(remoteUrl);

        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            return URL.createObjectURL(blob);
        }

        const response = await fetch(remoteUrl);
        if (response.ok) {
            cache.put(remoteUrl, response.clone());
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
    } catch (err) {
        console.warn(`Fallback para imagem online da carta ${id}:`, err);
    }

    return remoteUrl;
}