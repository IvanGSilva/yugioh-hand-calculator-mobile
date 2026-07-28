import { buscarBanco, sincronizarBanco, obterUrlImagemCarta } from './api.js';
import { processarConteudoYDK } from './ydk.js';
import { testarMaoValida, classificarTipoMao } from './calc.js';
import { 
    renderizarWorkspace, 
    atualizarPainelEstatisticas, 
    resetarInterface, 
    obterClasseBorda, 
    obterFeedbackVisual 
} from './ui.js';

let bancoCartas = [];
let deckAtual = [];

// --- Funções de Estado ---
function salvarSessaoDecks() {
    localStorage.setItem('ygo_deck_atual_v2', JSON.stringify(deckAtual));
}

async function recuperarSessaoDecks() {
    const deckSalvo = localStorage.getItem('ygo_deck_atual_v2');
    if (deckSalvo) {
        deckAtual = JSON.parse(deckSalvo);
        await renderizarWorkspace(deckAtual, moverPrioridade, toggleRole);
    }
}

// --- Lógica de Interação ---
window.toggleRole = async function(index, role) {
    const scrollPos = window.scrollY;
    
    const roles = deckAtual[index].roles || [];
    const roleIdx = roles.indexOf(role);
    roleIdx > -1 ? roles.splice(roleIdx, 1) : roles.push(role);
    
    deckAtual[index].roles = roles;
    salvarSessaoDecks();
    
    await renderizarWorkspace(deckAtual, moverPrioridade, toggleRole);
    window.scrollTo(0, scrollPos);
};

window.moverPrioridade = async function(cardIndex, roleIndex, direcao) {
    const scrollPos = window.scrollY; 
    
    const roles = deckAtual[cardIndex].roles;
    const targetIndex = roleIndex + direcao;

    if (targetIndex >= 0 && targetIndex < roles.length) {
        [roles[roleIndex], roles[targetIndex]] = [roles[targetIndex], roles[roleIndex]];
    }
    salvarSessaoDecks();
    
    await renderizarWorkspace(deckAtual, moverPrioridade, toggleRole);
    window.scrollTo(0, scrollPos);
};

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega o banco
    try {
        bancoCartas = await buscarBanco();
        document.getElementById('db-status').classList.add('hidden');
        document.getElementById('db-loaded').textContent = t("db_loaded", { count: bancoCartas.length });
        await recuperarSessaoDecks();
    } catch (err) {
        console.error(err);
    }

    // Evento de Sincronização
    document.getElementById('btn-sync').addEventListener('click', async () => {
        await sincronizarBanco();
        bancoCartas = await buscarBanco();
        await renderizarWorkspace(deckAtual, moverPrioridade, toggleRole);
    });

    // Evento de Upload (YDK) - Corrigido: adicionado async na função do FileReader
    document.getElementById('ydk-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (evt) => {
            deckAtual = processarConteudoYDK(evt.target.result, bancoCartas, deckAtual);
            salvarSessaoDecks();
            await renderizarWorkspace(deckAtual, moverPrioridade, toggleRole);
        };
        reader.readAsText(file);
    });

    // Evento de Cálculo - Corrigido: adicionado async no listener do botão
    document.getElementById('btn-calculate').addEventListener('click', async () => {
    
        resetarInterface();
        
        const handSize = parseInt(document.getElementById('hand-size').value);
        const reqStarters = parseInt(document.getElementById('cond-starters').value) || 0;
        const reqExtenders = parseInt(document.getElementById('cond-extenders').value) || 0;
        const reqNonEngine = parseInt(document.getElementById('cond-nonengine').value) || 0;
        const maxBricks = parseInt(document.getElementById('cond-bricks').value) ?? 99;

        const linearDeck = [];
        deckAtual.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                linearDeck.push({
                    card: item.card,
                    roles: Array.isArray(item.roles) ? [...item.roles] : []
                });
            }
        });

        if (linearDeck.length < handSize) {
            alert(t("err_small_deck"));
            return;
        }

        const RUNS = 100000;
        let sucessos = 0;

        for (let s = 0; s < RUNS; s++) {
            const sample = [...linearDeck];
            const maoRolesSimulada = [];

            for (let i = 0; i < handSize; i++) {
                const randIndex = i + Math.floor(Math.random() * (sample.length - i));
                const temp = sample[i];
                sample[i] = sample[randIndex];
                sample[randIndex] = temp;
                maoRolesSimulada.push([...sample[i].roles]); 
            }

            if (testarMaoValida(maoRolesSimulada, reqStarters, reqExtenders, reqNonEngine, maxBricks)) {
                sucessos++;
            }
        }

        const probabilidade = (sucessos / RUNS) * 100;

        // --- RENDERIZAR AS 10 MÃOS VISUAIS ---
        const handsContainer = document.getElementById('hands-container');
        handsContainer.innerHTML = '';

        for (let h = 0; h < 10; h++) {
            const pool = [...linearDeck];
            const maoExemplo = [];
            for (let i = 0; i < handSize; i++) {
                const randIndex = i + Math.floor(Math.random() * (pool.length - i));
                const temp = pool[i];
                pool[i] = pool[randIndex];
                pool[randIndex] = temp;
                maoExemplo.push(pool[i]);
            }

            const mapeamentoRolesExemplo = maoExemplo.map(item => [...item.roles]);
            const classificacao = classificarTipoMao(mapeamentoRolesExemplo, reqStarters, reqExtenders, reqNonEngine, maxBricks);
            
            const handRow = document.createElement('div');
            handRow.className = 'simulated-hand-row';
            handRow.style.borderLeft = `4px solid ${classificacao.cor}`;

            const statusMao = `<span style="color: ${classificacao.cor}; font-weight: bold;">[${classificacao.label.toUpperCase()}]</span>`;

            let cardsHTML = '';
            for (const item of maoExemplo) {
                const imgUrl = item.card && item.card.id 
                    ? await obterUrlImagemCarta(item.card.id) 
                    : 'https://images.ygoprodeck.com/images/cards/placeholder.jpg';
                    
                const borderClass = obterClasseBorda(item.roles);

                cardsHTML += `
                    <div class="hand-card-item">
                        <img src="${imgUrl}" class="${borderClass}" title="${item.card.name}" loading="lazy">
                        <div class="hand-card-name">${item.card.name}</div>
                    </div>
                `;
            }

            handRow.innerHTML = `
                <div class="hand-title">${t("hand_label")} #${h + 1} - ${statusMao}</div>
                <div class="hand-cards">
                    ${cardsHTML}
                </div>
            `;
            handsContainer.appendChild(handRow);
        }

        const feedback = obterFeedbackVisual(probabilidade);
        const resultBox = document.getElementById('result-box');
        const percentageText = document.getElementById('calc-percentage');
        
        resultBox.classList.remove('hidden');
        percentageText.textContent = `${probabilidade.toFixed(2)}%`;
        percentageText.style.color = feedback.color;
        
        document.getElementById('calc-details').innerHTML = `
            <strong>${feedback.text}</strong><br>
            <span style="font-size: 0.9rem; color: #8d8d99; display: block; margin-top: 8px;">
                ${t("sim_desc", { 
                    RUNS: RUNS, 
                    size: handSize, 
                    "linearDeck.length": linearDeck.length 
                })}
            </span>
        `;

        await atualizarPainelEstatisticas(deckAtual);
        
        resultBox.scrollIntoView({ behavior: 'smooth' });
    });

    initI18n();
});