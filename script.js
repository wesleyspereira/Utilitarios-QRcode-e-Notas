// --- CALCULADORA ---
const display = document.getElementById('display');
let currentInput = '';
let resultDisplayed = false;

function updateDisplay(value) {
  display.textContent = value || '0';
}

function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = '';
    resultDisplayed = false;
  }
  if (num === '.' && currentInput.includes('.')) return;
  currentInput += num;
  updateDisplay(currentInput);
}

function appendOperator(op) {
  if (resultDisplayed) resultDisplayed = false;
  if (currentInput === '') return;
  if (['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay(currentInput);
}

function clearAll() {
  currentInput = '';
  updateDisplay('0');
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput);
}

function calculate() {
  if (!currentInput) return;
  try {
    let expr = currentInput.replace(/%/g, '*0.01');
    let result = Function('"use strict";return (' + expr + ')')();
    result = Math.round((result + Number.EPSILON) * 1000000000) / 1000000000;
    updateDisplay(result);
    currentInput = result.toString();
    resultDisplayed = true;
  } catch {
    updateDisplay('Erro');
    currentInput = '';
  }
}

document.querySelectorAll('.calculator button').forEach(button => {
  button.addEventListener('click', () => {
    if (button.hasAttribute('data-num')) {
      appendNumber(button.getAttribute('data-num'));
    } else if (button.classList.contains('operator')) {
      if (button.id === 'equals') {
        calculate();
      } else {
        appendOperator(button.getAttribute('data-op'));
      }
    } else if (button.id === 'clear') {
      clearAll();
    } else if (button.id === 'backspace') {
      backspace();
    } else if (button.id === 'percent') {
      appendOperator('%');
    }
  });
});

// --- GERADOR DE QR CODE ---
const qrInput = document.getElementById('qr-input');
const qrCodeDiv = document.getElementById('qr-code');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-qr');

generateBtn.addEventListener('click', () => {
  const text = qrInput.value.trim();
  if (!text) {
    alert('Digite algo para gerar o QR Code!');
    return;
  }

  qrCodeDiv.innerHTML = '';

  new QRCode(qrCodeDiv, {
    text: text,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
});

clearBtn.addEventListener('click', () => {
  qrCodeDiv.innerHTML = '';
  qrInput.value = '';
});
