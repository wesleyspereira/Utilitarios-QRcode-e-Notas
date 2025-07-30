// === QR Code ===
const qrBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-qr");
const qrInput = document.getElementById("qr-input");
const qrCode = document.getElementById("qr-code");

qrBtn.addEventListener("click", () => {
  if (qrInput.value.trim() === "") {
    alert("Digite algo para gerar o QR Code!");
    return;
  }
  qrCode.innerHTML = "";
  new QRCode(qrCode, qrInput.value);
});

clearBtn.addEventListener("click", () => {
  qrCode.innerHTML = "";
  qrInput.value = "";
});

// === Notas com prioridade ===
const blocoNotas = document.getElementById("bloco-notas");
const notaTexto = document.getElementById("nota-texto");
const prioridadeBtns = document.querySelectorAll(".prioridade button");

prioridadeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const prioridade = btn.getAttribute("data-prioridade");
    const nota = notaTexto.value.trim();

    if (!nota) {
      alert("Digite uma nota antes.");
      return;
    }

    const div = document.createElement("div");
    div.classList.add("nota", prioridade);
    div.innerText = `[${prioridade.toUpperCase()}] ${nota}`;
    blocoNotas.appendChild(div);
    notaTexto.value = "";
  });
});

// === Limpar notas ===
function limparNotas() {
  blocoNotas.innerHTML = "";
}

// === Gerar planilha CSV ===
function gerarPlanilha() {
  const dados = [
    ["Nota", "Prioridade", "Data"]
  ];

  const notas = document.querySelectorAll(".nota");
  notas.forEach(nota => {
    const prioridade = nota.classList.contains("alta") ? "Alta" :
                       nota.classList.contains("media") ? "Média" : "Baixa";
    const texto = nota.innerText.replace(/\[.*?\]\s*/, "");
    dados.push([texto, prioridade, new Date().toLocaleDateString()]);
  });

  let csv = "data:text/csv;charset=utf-8,";
  dados.forEach(row => {
    csv += row.join(",") + "\n";
  });

  const encodedUri = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "planilha.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
