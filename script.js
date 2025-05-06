document.addEventListener('DOMContentLoaded', function() {
    // Dados do cardápio (pode ser substituído por uma API no futuro)
    const cardapio = {
        comidas: [
            { id: 1, nome: "Pizza Margherita", descricao: "Molho de tomate, mussarela e manjericão", preco: 45.90, imagem: "https://img.freepik.com/fotos-gratis/pizza-margherita-classica_141793-177.jpg" },
            { id: 2, nome: "Hambúrguer Artesanal", descricao: "Pão brioche, carne 180g, queijo cheddar", preco: 32.50, imagem: "https://img.freepik.com/fotos-gratis/vista-frontal-delicioso-hamburguer-de-carne-com-queijo-e-salada-de-fundo-escuro-refeicao-fast-food-carne-grelhada-lanche_140725-89543.jpg" },
            { id: 3, nome: "Salada Caesar", descricao: "Alface, croutons, parmesão e molho caesar", preco: 28.75, imagem: "https://img.freepik.com/fotos-gratis/salada-caesar-com-frango-e-croutons_2829-19268.jpg" },
            { id: 4, nome: "Lasanha à Bolonhesa", descricao: "Massa fresca, molho bolonhesa e queijo", preco: 39.90, imagem: "https://img.freepik.com/fotos-gratis/lasanha-tradicional-no-prato_2829-18880.jpg" },
            { id: 5, nome: "Prato Feito", descricao: "arroz, feijão, legumes, 2 carnes, salada alface tomate", preco: 20,00}
        ],
        bebidas: [
            { id: 6, nome: "Refrigerante Lata", descricao: "Coca-Cola, Guaraná, Fanta ou Sprite", preco: 6.50, imagem: "https://img.freepik.com/fotos-gratis/lata-de-refrigerante_144627-16501.jpg" },
            { id: 7, nome: "Suco Natural", descricao: "Laranja, abacaxi ou maracujá", preco: 8.90, imagem: "https://img.freepik.com/fotos-gratis/copo-de-suco-de-laranja-fresco-isolado-no-fundo-branco_114579-25819.jpg" },
            { id: 8, nome: "Água Mineral", descricao: "Com ou sem gás", preco: 4.50, imagem: "https://img.freepik.com/fotos-gratis/garrafa-de-agua-isolada_1303-1003.jpg" },
            { id: 9, nome: "Cerveja Artesanal", descricao: "Chopp 300ml", preco: 12.90, imagem: "https://img.freepik.com/fotos-gratis/copo-de-cerveja-de-vidro-cheio-de-cerveja_140725-1261.jpg" }
        ],
        sobremesas: [
            { id: 10, nome: "Brownie com Sorvete", descricao: "Brownie quente com sorvete de creme", preco: 18.90, imagem: "https://img.freepik.com/fotos-gratis/delicioso-brownie-de-chocolate-com-sorvete_23-2148917404.jpg" },
            { id: 11, nome: "Mousse de Chocolate", descricao: "Mousse cremosa com calda de chocolate", preco: 14.50, imagem: "https://img.freepik.com/fotos-gratis/close-up-de-mousse-de-chocolate-com-frutas-vermelhas_181624-35844.jpg" },
            { id: 12, nome: "Cheesecake", descricao: "Torta de queijo com calda de frutas vermelhas", preco: 16.90, imagem: "https://img.freepik.com/fotos-gratis/fatia-de-cheesecake-com-morangos_144627-27267.jpg" },
            { id: 13, nome: "Sorvete", descricao: "3 bolas - sabores diversos", preco: 12.90, imagem: "https://img.freepik.com/fotos-gratis/sorvete-colorido-em-uma-tigela_144627-30794.jpg" }
        ]
    };

    // Variáveis do pedido
    let pedido = [];
    let total = 0;

    // Elementos DOM
    const mesaInput = document.getElementById('mesa');
    const pedidoItensContainer = document.getElementById('pedido-itens');
    const pedidoTotalElement = document.getElementById('pedido-total');
    const limparPedidoBtn = document.getElementById('limpar-pedido');
    const enviarCozinhaBtn = document.getElementById('enviar-cozinha');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const imprimirPedidoBtn = document.getElementById('imprimir-pedido');
    const closeModal = document.querySelector('.close');

    // Botões de categoria
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const categoriasSections = document.querySelectorAll('.itens-cardapio');

    // Carregar itens do cardápio
    function carregarItensCardapio() {
        for (const categoria in cardapio) {
            const section = document.getElementById(categoria);
            const grid = section.querySelector('.itens-grid');
            
            cardapio[categoria].forEach(item => {
                const itemElement = criarItemCardapio(item);
                grid.appendChild(itemElement);
            });
        }
    }

    // Criar elemento de item do cardápio
    function criarItemCardapio(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-cardapio';
        
        itemElement.innerHTML = `
            <div class="item-imagem" style="background-image: url('${item.imagem}')"></div>
            <div class="item-info">
                <div class="item-nome">${item.nome}</div>
                <div class="item-descricao">${item.descricao}</div>
                <div class="item-preco">R$ ${item.preco.toFixed(2)}</div>
                <div class="item-botoes">
                    <button class="adicionar" data-id="${item.id}">Adicionar</button>
                </div>
            </div>
        `;
        
        return itemElement;
    }

    // Atualizar visualização do pedido
    function atualizarPedidoView() {
        pedidoItensContainer.innerHTML = '';
        
        if (pedido.length === 0) {
            pedidoItensContainer.innerHTML = '<p class="vazio">Nenhum item adicionado</p>';
            pedidoTotalElement.textContent = '0.00';
            return;
        }
        
        pedido.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'pedido-item';
            
            itemElement.innerHTML = `
                <div>
                    <span class="pedido-item-nome">${item.nome}</span>
                    <span class="pedido-item-quantidade">x${item.quantidade}</span>
                </div>
                <div class="pedido-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
            `;
            
            pedidoItensContainer.appendChild(itemElement);
        });
        
        calcularTotal();
    }

    // Calcular total do pedido
    function calcularTotal() {
        total = pedido.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        pedidoTotalElement.textContent = total.toFixed(2);
    }

    // Adicionar item ao pedido
    function adicionarItem(id) {
        let itemEncontrado = null;
        
        // Procurar o item em todas as categorias
        for (const categoria in cardapio) {
            const item = cardapio[categoria].find(i => i.id === id);
            if (item) {
                itemEncontrado = item;
                break;
            }
        }
        
        if (!itemEncontrado) return;
        
        // Verificar se o item já está no pedido
        const itemNoPedido = pedido.find(item => item.id === id);
        
        if (itemNoPedido) {
            itemNoPedido.quantidade += 1;
        } else {
            pedido.push({
                ...itemEncontrado,
                quantidade: 1
            });
        }
        
        atualizarPedidoView();
    }

    // Limpar pedido
    function limparPedido() {
        pedido = [];
        total = 0;
        atualizarPedidoView();
    }

    // Enviar pedido para cozinha
    function enviarParaCozinha() {
        if (pedido.length === 0) {
            alert('Adicione itens ao pedido antes de enviar!');
            return;
        }
        
        const mesa = mesaInput.value || 1;
        
        modalMessage.innerHTML = `
            <p>Pedido da Mesa ${mesa} enviado com sucesso!</p>
            <p>Total: R$ ${total.toFixed(2)}</p>
        `;
        
        modal.style.display = 'block';
    }

    // Imprimir comanda
    function imprimirComanda() {
        const mesa = mesaInput.value || 1;
        const conteudo = `
            <h1>Comanda - Mesa ${mesa}</h1>
            <h2>Itens do Pedido:</h2>
            <ul>
                ${pedido.map(item => `
                    <li>${item.nome} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>
                `).join('')}
            </ul>
            <h2>Total: R$ ${total.toFixed(2)}</h2>
            <p>${new Date().toLocaleString()}</p>
        `;
        
        const janelaImpressao = window.open('', '_blank');
        janelaImpressao.document.write(`
            <html>
                <head>
                    <title>Comanda Mesa ${mesa}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; text-align: center; }
                        h2 { color: #444; margin-top: 20px; }
                        ul { list-style-type: none; padding: 0; }
                        li { margin-bottom: 8px; }
                    </style>
                </head>
                <body>
                    ${conteudo}
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 200);
                        };
                    </script>
                </body>
            </html>
        `);
    }

    // Trocar categoria
    function trocarCategoria(event) {
        const categoria = event.target.dataset.categoria;
        
        categoriaBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        event.target.classList.add('active');
        
        categoriasSections.forEach(section => {
            section.style.display = 'none';
        });
        
        document.getElementById(categoria).style.display = 'block';
    }

    // Event Listeners
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', trocarCategoria);
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('adicionar')) {
            const id = parseInt(event.target.dataset.id);
            adicionarItem(id);
        }
    });

    limparPedidoBtn.addEventListener('click', limparPedido);
    enviarCozinhaBtn.addEventListener('click', enviarParaCozinha);
    imprimirPedidoBtn.addEventListener('click', imprimirComanda);
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        limparPedido();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            limparPedido();
        }
    });

    // Inicialização
    carregarItensCardapio();
});
