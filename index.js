async function startup() {
  let palavra = await buscaPalavraAPI();
  palavra = palavra
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase();

  console.log(palavra);

  let vidas = 6;
  let letrasChutadas = [];

  const outputPalavra = document.getElementById("palavra");
  const outputVidas = document.getElementById("vidasRestantes");
  const inputPalavra = document.getElementById("chutePalavra");
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
    outputVidas.innerText = `Vidas restantes: ${vidas}`;
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
  }

  btnChutar.addEventListener("click", (e) => {
    e.preventDefault();

    const chute = inputPalavra.value.toUpperCase();

    if (chute.length > 1) {
      if (chute === palavra) {
        outputPalavra.innerText = palavra;
        alert("Você venceu!");
      } else {
        vidas--;
        preencheVidas();
      }
    } else if (/^[A-Z]$/.test(chute) && !letrasChutadas.includes(chute)) {
      letrasChutadas.push(chute);
      preencheLetrasChutadas();

      if (palavra.includes(chute)) {
        for (let i = 0; i < palavra.length; i++) {
          if (palavra[i] === chute) {
            palavraEscondida[i] = chute;
          }
        }
        preenchePalavra();
      } else {
        vidas--;
        preencheVidas();
      }

      salvaEstadoJogo();
    } else {
      alert(
        "Digite um caracter válido e que já não tenha sido digitado antes!"
      );
    }

    if (palavraEscondida.join([(separador = "")]) === palavra) {
      alert("Você venceu!");
      btnChutar.disabled = true;
      jogoTerminou = true;
      perguntarJogarNovamente();
      localStorage.clear();
    } else if (vidas <= 0) {
      alert(`Você perdeu!` + "\n" + `A palavra era: ${palavra}`);
      btnChutar.disabled = true;
      perguntarJogarNovamente();
      localStorage.clear();
    }
  });
}

startup();
