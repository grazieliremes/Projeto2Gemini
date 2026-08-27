<script>
    const synth = window.speechSynthesis;
    let modoAtual = null;
    let tamanhoFonteAtual = 20;

    // Atalhos globais do teclado (1 para Cego, 2 para Baixa Visão, Esc para parar voz)
    document.addEventListener('keydown', (e) => {
      if (e.key === '1') {
        ativarModoCego();
      } else if (e.key === '2') {
        ativarModoBaixaVisao();
      } else if (e.key === 'Escape') {
        pararVoz();
      }
    });

    function falar(texto, aoFinalizar = null) {
      if (!('speechSynthesis' in window)) {
        console.warn("Navegador não possui suporte para síntese de fala.");
        return;
      }

      synth.cancel();

      const mensagem = new SpeechSynthesisUtterance(texto);
      mensagem.lang = 'pt-BR';
      mensagem.rate = 1.0;
      mensagem.pitch = 1.0;

      document.getElementById('painel-voz').classList.remove('escondido');

      mensagem.onend = () => {
        if (aoFinalizar) aoFinalizar();
        if (!synth.speaking) {
          document.getElementById('painel-voz').classList.add('escondido');
        }
      };

      mensagem.onerror = () => {
        document.getElementById('painel-voz').classList.add('escondido');
      };

      synth.speak(mensagem);
    }

    function pararVoz() {
      synth.cancel();
      document.getElementById('painel-voz').classList.add('escondido');
      removerDestaqueLeitura();
      
      const status = document.getElementById('status-modo');
      if (status) {
        status.innerText = "Leitura interrompida.";
      }
    }

    function ativarModoCego() {
      modoAtual = 'cego';
      document.body.classList.add('modo-cego-ativo');

      document.getElementById('btn-modo-cego').classList.add('ativo');
      document.getElementById('btn-modo-baixa-visao').classList.remove('ativo');
      
      const status = document.getElementById('status-modo');
      status.innerText = "Modo Pessoa Cega Ativado. A voz de IA iniciará a leitura automática agora.";

      const introducao = "Modo Pessoa Cega ativado. Bem-vindo ao Guia de Segurança Digital. Vou ler automaticamente todas as dicas para você. Dica 1:";
      
      const cartoes = document.querySelectorAll('.card-dica');
      let indice = 0;

      function lerProximoCartao() {
        if (indice >= cartoes.length) {
          falar("Fim das dicas de segurança digital. Você pode pressionar 1 para ouvir novamente ou navegar usando a tecla tab.");
          removerDestaqueLeitura();
          return;
        }

        const cartao = cartoes[indice];
        removerDestaqueLeitura();
        cartao.classList.add('lendo-agora');
        cartao.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const titulo = cartao.querySelector('h3').innerText;
        const texto = cartao.querySelector('p').innerText;
        const textoCompleto = `${titulo}. ${texto}`;

        falar(textoCompleto, () => {
          indice++;
          setTimeout(lerProximoCartao, 800);
        });
      }

      falar(introducao, () => {
        lerProximoCartao();
      });
    }

    function ativarModoBaixaVisao() {
      modoAtual = 'baixa-visao';
      document.body.classList.remove('modo-cego-ativo');
      pararVoz();

      document.getElementById('btn-modo-baixa-visao').classList.add('ativo');
      document.getElementById('btn-modo-cego').classList.remove('ativo');

      const status = document.getElementById('status-modo');
      status.innerText = "Modo Baixa Visão Ativado. Clique em 'Ler para mim' em qualquer dica para ouvir a leitura.";

      falar("Modo Baixa Visão ativado. Utilize os botões Ler para Mim abaixo de cada dica para ouvir a leitura de um item específico.");
    }

    function lerTextoIndividual(texto) {
      pararVoz();
      falar(texto);
    }

    function removerDestaqueLeitura() {
      document.querySelectorAll('.card-dica').forEach(c => c.classList.remove('lendo-agora'));
    }

    function alterarFonte(delta) {
      tamanhoFonteAtual = Math.max(16, Math.min(32, tamanhoFonteAtual + delta));
      document.documentElement.style.setProperty('--tamanho-fonte-base', `${tamanhoFonteAtual}px`);
    }
  