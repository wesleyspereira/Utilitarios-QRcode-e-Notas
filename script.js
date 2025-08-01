// === Variáveis globais ===
let usuarioAtual = "";

// Função para gerar chave única por usuário
function getChave(chave) {
  return `${usuarioAtual}_${chave}`;
}

// Referências
const qrBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-qr");
const qrInput = document.getElementById("qr-input");
const qrCode = document.getElementById("qr-code");
const historico = document.getElementById("lista-historico");
const blocoNotas = document.getElementById("bloco-notas");
const notaTexto = document.getElementById("nota-texto");
const prioridadeBtns = document.querySelectorAll(".prioridade button");

qrBtn.addEventListener("click", () => {
  const texto = qrInput.value.trim();
  if (texto === "") {
    alert("Digite algo para gerar o QR Code!");
    return;
  }

  qrCode.innerHTML = "";
  new QRCode(qrCode, texto);

  if (usuarioAtual) {
    localStorage.setItem(getChave("qrcode"), texto);
  }

  atualizarHistoricoQR();
});

clearBtn.addEventListener("click", () => {
  qrCode.innerHTML = "";
  qrInput.value = "";
  historico.innerHTML = "";
  if (usuarioAtual) {
    localStorage.removeItem(getChave("qrcode"));
  }
});

function baixarQRCode() {
  const img = qrCode.querySelector("img");
  if (!img || !img.src) {
    alert("Nenhum QR Code disponível para download.");
    return;
  }

  const link = document.createElement("a");
  link.href = img.src;
  link.download = `qrcode_${usuarioAtual || 'usuario'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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

    const excluirBtn = document.createElement("button");
    excluirBtn.textContent = "❌";
    excluirBtn.classList.add("excluir-nota");
    excluirBtn.onclick = () => {
      div.remove();
      salvarNotas();
    };

    div.appendChild(excluirBtn);
    blocoNotas.appendChild(div);
    notaTexto.value = "";
    salvarNotas();
  });
});

function salvarNotas() {
  if (!usuarioAtual) return;
  const notas = [];
  document.querySelectorAll(".nota").forEach(nota => {
    notas.push({
      texto: nota.innerText.replace("❌", "").trim(),
      prioridade: nota.classList.contains("alta") ? "alta" :
        nota.classList.contains("media") ? "media" : "baixa"
    });
  });
  localStorage.setItem(getChave("notas"), JSON.stringify(notas));
}

function limparNotas() {
  blocoNotas.innerHTML = "";
  if (usuarioAtual) {
    localStorage.removeItem(getChave("notas"));
  }
}

function atualizarHistoricoQR() {
  historico.innerHTML = "";
  const ultimoQR = localStorage.getItem(getChave("qrcode"));
  if (ultimoQR) {
    const li = document.createElement("li");
    li.innerHTML = `Último QR Code: <a href="#" onclick="baixarQRCode()">Baixar</a>`;
    historico.appendChild(li);
  }
}

function carregarDados() {
  blocoNotas.innerHTML = "";
  qrCode.innerHTML = "";
  qrInput.value = "";
  historico.innerHTML = "";

  // Carregar notas
  const notasSalvas = JSON.parse(localStorage.getItem(getChave("notas"))) || [];
  notasSalvas.forEach(n => {
    const div = document.createElement("div");
    div.classList.add("nota", n.prioridade);
    div.innerText = `[${n.prioridade.toUpperCase()}] ${n.texto}`;

    const excluirBtn = document.createElement("button");
    excluirBtn.textContent = "❌";
    excluirBtn.classList.add("excluir-nota");
    excluirBtn.onclick = () => {
      div.remove();
      salvarNotas();
    };

    div.appendChild(excluirBtn);
    blocoNotas.appendChild(div);
  });

  // Carregar último QR Code no histórico
  atualizarHistoricoQR();
}

// === LOGIN E REGISTRO ===

function registrarUsuario() {
  const nome = document.getElementById("login-nome").value.trim();
  const senha = document.getElementById("login-senha").value.trim();
  const mensagem = document.getElementById("login-mensagem");
  if (!nome || !senha) {
    mensagem.style.color = "red";
    mensagem.innerText = "Preencha nome e senha.";
    return;
  }
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
  if (usuarios[nome]) {
    mensagem.style.color = "red";
    mensagem.innerText = "Usuário já cadastrado.";
    return;
  }
  usuarios[nome] = senha;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mensagem.style.color = "green";
  mensagem.innerText = "Cadastro realizado com sucesso!";
}

function loginUsuario() {
  const nome = document.getElementById("login-nome").value.trim();
  const senha = document.getElementById("login-senha").value.trim();
  const mensagem = document.getElementById("login-mensagem");
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
  if (usuarios[nome] && usuarios[nome] === senha) {
    usuarioAtual = nome;
    document.getElementById("login-container").style.display = "none";
    document.querySelector("main.container").style.display = "block";
    document.getElementById("logout-btn").style.display = "inline-block";
    mensagem.innerText = "";
    document.getElementById("usuario-nome").innerText = usuarioAtual;
    carregarDados();
  } else {
    mensagem.style.color = "red";
    mensagem.innerText = "Usuário ou senha inválidos.";
  }
}

function logoutUsuario() {
  usuarioAtual = "";
  document.getElementById("login-container").style.display = "block";
  document.querySelector("main.container").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
  document.getElementById("usuario-nome").innerText = "";
  document.getElementById("login-mensagem").innerText = "";
  // Limpar dados visuais
  blocoNotas.innerHTML = "";
  qrCode.innerHTML = "";
  qrInput.value = "";
  historico.innerHTML = "";
}

// Inicialização da página
window.onload = () => {
  document.getElementById("logout-btn").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  document.querySelector("main.container").style.display = "none";
  usuarioAtual = "";
};
