const palavra = "BANANA";
let vidas = 6;
const letrasChutadas = [];

const outputPalavra = document.getElementById("palavra");
const outputVidas = document.getElementById("vidasRestantes");
const inputPalavra = document.getElementById("chutePalavra");
const btnChutar = document.getElementById("btnChutar");
const outputLetrasChutadas = document.getElementById("letrasChutadas");

let palavraEscondida = [];

for (let char of palavra) {
  palavraEscondida.push("-");
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

preenchePalavra();
preencheVidas();

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
    } else {
      vidas--;
      preencheVidas();
    }

    preenchePalavra();
  } else {
    alert("Digite um caracter válido e que já não tenha sido digitado antes!");
  }

  if (palavraEscondida.join([(separador = "")]) === palavra) {
    alert("Você venceu!");
    btnChutar.disabled = true;
  }
});
