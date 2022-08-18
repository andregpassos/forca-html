async function startup() {
  const teclasErgonomicas = [
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L',
  'Z','X','C','V','B','N','M']

  const pedacoTeclado = {
    top: "tecladoVirtualTop",
    mid: "tecladoVirtualMid",
    bot: "tecladoVirtualBot",
  };

  function estilizarTecla(btnLetra) {
    btnLetra.style.margin = "2px";
    btnLetra.style.cursor = "pointer";
    btnLetra.style.height = "35px";
    btnLetra.style.width = "35px";
  }

  function criarTecladoVirtual (divPedacoTeclado) {
    let inicio = 0;
    let fim = 0;

    switch (divPedacoTeclado) {
      case pedacoTeclado.top:
        inicio = 0;
        fim = 9;
        break;
      case pedacoTeclado.mid:
        inicio = 10;
        fim = 18;
        break;
      case pedacoTeclado.bot:
        inicio = 19;
        fim = 25;
        break;
    }
    
    const divTecladoVirtual = document.getElementById(divPedacoTeclado);
    for (let i = inicio; i <= fim; i++) {
      let btnLetra = document.createElement("button");
      btnLetra.id = `btn${teclasErgonomicas[i]}`;
      estilizarTecla(btnLetra);
      btnLetra.innerText = teclasErgonomicas[i];
      divTecladoVirtual.appendChild(btnLetra);
    }
  }

  criarTecladoVirtual(pedacoTeclado.top);
  criarTecladoVirtual(pedacoTeclado.mid);
  criarTecladoVirtual(pedacoTeclado.bot);
  
  function criarClicksTeclas () {
    for (let tecla of teclasErgonomicas) {
      const btnTecla = document.getElementById(`btn${tecla}`);

      btnTecla.addEventListener('click', (e) => {
        e.preventDefault();

        const tentativa = tecla;

        if (!letrasChutadas.includes(tentativa)) {
          letrasChutadas.push(tentativa);
          preencheLetrasChutadas();

          if (palavra.includes(tentativa)) {
            for (let i = 0; i < palavra.length; i++) {
              if (palavra[i] === tentativa) {
                palavraEscondida[i] = tentativa;
              }
            }
            preenchePalavra();
          } else {
            vidas--;
            preencheVidas();
          }

          salvaEstadoJogo();
        } else {
          alert("Digite um caracter que não tenha sido digitado antes!");
        }

        function finalizarJogoTeclas() {
          btnChutar.disabled = true;

          for (let tecla of teclasErgonomicas) {
            const btnTecla = document.getElementById(`btn${tecla}`);
            btnTecla.disabled = true;
            btnTecla.style.cursor = "auto";
          }

          perguntarJogarNovamente();
        }

        if (palavraEscondida.join([(separador = "")]) === palavra) {
          alert("Você venceu!");
          finalizarJogoTeclas();
        } else if (vidas <= 0) {
          alert(`Você perdeu!` + "\n" + `A palavra era: ${palavra}`);
          finalizarJogoTeclas();
        }
      });
    }
  }

  criarClicksTeclas();

  let palavra = await buscaPalavraAPI();
  palavra = palavra
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase();

  let vidas = 6;
  let letrasChutadas = [];

  const outputPalavra = document.getElementById("palavra");
  const outputVidas = document.getElementById("vidasRestantes");
  const btnChutar = document.getElementById("btnChutar");
  const outputLetrasChutadas = document.getElementById("letrasChutadas");

  let palavraEscondida = [];

  let estadoJogo = {
    palavra: palavra,
    palavra_oculta: palavraEscondida,
    vidas_restantes: vidas,
    letras_chutadas: letrasChutadas,
  };

  const localStrgEstadoJogo = localStorage.getItem("estadoJogo");

  if (localStrgEstadoJogo !== null && localStrgEstadoJogo !== undefined) {
    estadoJogo = JSON.parse(localStrgEstadoJogo);
    carregaEstadoJogo();
  } else {
    for (let char of palavra) {
      palavraEscondida.push("_");
    }

    localStorage.setItem("estadoJogo", JSON.stringify(estadoJogo));
  }

  function preenchePalavra() {
    outputPalavra.innerText = "";

    for (let char of palavraEscondida) {
      outputPalavra.innerText += ` ${char}`;
    }
  }

  function preencheVidas() {
    outputVidas.innerText = "";
    
    for (let i = 0; i < vidas; i++) {
      outputVidas.innerText += "🖤";
    }
  }

  function preencheLetrasChutadas() {
    outputLetrasChutadas.innerText = `Letras chutadas: ${letrasChutadas}`;
  }

  function salvaEstadoJogo() {
    estadoJogo.palavra = palavra;
    estadoJogo.palavra_oculta = palavraEscondida;
    estadoJogo.vidas_restantes = vidas;
    estadoJogo.letras_chutadas = letrasChutadas;

    localStorage.setItem("estadoJogo", JSON.stringify(estadoJogo));
  }

  function carregaEstadoJogo() {
    palavra = estadoJogo.palavra;
    palavraEscondida = estadoJogo.palavra_oculta;
    vidas = estadoJogo.vidas_restantes;
    letrasChutadas = estadoJogo.letras_chutadas;
  }

  async function buscaPalavraAPI() {
    const url = "https://api.dicionario-aberto.net/random";

    let word = "";
    await fetch(url)
      .then((response) => response.json())
      .then((r) => {
        word = r.word;
      })
      .catch((e) => {
        console.log(e);
        alert(
          "Ocorreu um erro ao buscar os dados da palavra.\nFavor recarregar a página."
        );
      });

    return word;
  }

  preenchePalavra();
  preencheVidas();
  preencheLetrasChutadas();

  function perguntarJogarNovamente() {
    let jogarNovamente = prompt("Deseja jogar novamente? (s/n)").toUpperCase();

    if (jogarNovamente === "S") location.reload();
    else alert("O jogo terminou!");

    localStorage.clear();
  }

  const palavrasChutadas = [];
  btnChutar.addEventListener("click", (e) => {
    e.preventDefault();

    const chute = prompt("Chute a palvra inteira: ").toUpperCase();
    
    //validacao do chute
    if (chute.length > 1) {
      if (! /[A-Z]/.test(chute)) {
        alert ("Digite caracteres válidos.");
      } else if (palavrasChutadas.includes(chute)) {
        alert("Essa palavra já foi tentada anteriormente.")
      } else if (chute === palavra) {
        outputPalavra.innerText = palavra;
        alert("Você venceu!");
      } else {
        vidas--;
        preencheVidas();
      }
      palavrasChutadas.push(chute);
    } else {
      alert("Uma palavra inteira deve ter mais de 1 caracter.")
    }
    
    //checar se venceu
    if (palavraEscondida.join([(separador = "")]) === palavra) {
      alert("Você venceu!");
      btnChutar.disabled = true;
      perguntarJogarNovamente();
    } else if (vidas <= 0) {
      alert(`Você perdeu!` + "\n" + `A palavra era: ${palavra}`);
      btnChutar.disabled = true;
      perguntarJogarNovamente();
    }
  });
}

startup();
