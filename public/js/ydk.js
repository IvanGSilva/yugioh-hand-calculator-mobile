export function processarConteudoYDK(conteudoYDK, bancoCartas, deckAtualAntigo = []) {
    const linhas = conteudoYDK.split(/\r?\n/);
    const idCounts = {};
    const ordemIds = [];
    let emMain = false;

    // Preserva as roles/prioridades antigas configuradas pelo usuário
    const rolesAntigasMap = {};
    if (Array.isArray(deckAtualAntigo)) {
        deckAtualAntigo.forEach(item => {
            const id = item.card?.id || item.card;
            if (id) rolesAntigasMap[id] = item.roles || [];
        });
    }

    for (let linha of linhas) {
        linha = linha.trim();
        if (linha === '#main') {
            emMain = true;
            continue;
        }
        if (linha.startsWith('#') || linha.startsWith('!')) {
            emMain = false;
            continue;
        }
        if (emMain && linha && !isNaN(linha)) {
            const id = parseInt(linha, 10);
            
            if (!idCounts[id]) {
                idCounts[id] = 0;
                ordemIds.push(id);
            }
            idCounts[id] += 1;
        }
    }

    const criarObjetoCarta = (id) => {
        if (Array.isArray(bancoCartas)) {
            return bancoCartas.find(c => c.id == id) || { id: id, name: `ID ${id}` };
        } else if (bancoCartas && bancoCartas[id]) {
            return bancoCartas[id];
        }
        return { id: id, name: `ID ${id}` };
    };

    // Constrói a lista respeitando a ordem guardada em ordemIds
    const novoDeck = ordemIds.map(id => {
        const cartaInfo = criarObjetoCarta(id);
        return {
            card: cartaInfo,
            count: idCounts[id],
            roles: rolesAntigasMap[id] || []
        };
    });

    return novoDeck;
}