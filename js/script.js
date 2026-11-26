'use strict';

var QUESTOES = [
  {
    enunciado: 'Qual é a classificação da água (H2O) entre as funções inorgânicas?',
    alternativas: ['Ácido', 'Óxido', 'Sal'],
    correta: 1,
    explicacao: 'A água é um composto binário em que o oxigênio é o elemento mais eletronegativo, o que define um óxido.'
  },
  {
    enunciado: 'No Minecraft, o que acontece quando a água toca um bloco-fonte de lava?',
    alternativas: ['Forma-se obsidiana', 'A água evapora e some', 'Forma-se areia'],
    correta: 0,
    explicacao: 'No jogo, água em contato com a lava fonte gera obsidiana. Na natureza, a obsidiana é um vidro vulcânico.'
  },
  {
    enunciado: 'Por que a fonte infinita de água do jogo não tem correspondente real?',
    alternativas: [
      'Porque a água não pode ser coletada',
      'Porque a massa se conserva e a água não surge do nada',
      'Porque a água real só existe no estado sólido'
    ],
    correta: 1,
    explicacao: 'Pela conservação da massa, a água não é criada. Na natureza ela se renova pelo ciclo da água, mas não de forma instantânea.'
  },
  {
    enunciado: 'Qual interação explica o ponto de ebulição relativamente alto da água?',
    alternativas: ['Ligações de hidrogênio', 'Ligações metálicas', 'Forças de dispersão apenas'],
    correta: 0,
    explicacao: 'Moléculas polares de H2O se atraem por ligações de hidrogênio, o que exige mais energia para separá-las.'
  },
  {
    enunciado: 'Qual é o processo usado para remover sais da água do mar?',
    alternativas: ['Dessalinização', 'Fluoretação', 'Combustão'],
    correta: 0,
    explicacao: 'A dessalinização, por osmose reversa ou destilação, retira sais da água do mar.'
  }
];
var LETRAS = ['A', 'B', 'C'];

function criar(tag, classe, texto) {
  var el = document.createElement(tag);
  if (classe) { el.className = classe; }
  if (texto) { el.textContent = texto; }
  return el;
}

function iniciarMenu() {
  var botao = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  if (!botao || !menu) { return; }

  function fechar() {
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
  }

  botao.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { fechar(); }
  });
}

function iniciarAnimacao() {
  var secoes = document.querySelectorAll('.animar');
  if (!('IntersectionObserver' in window)) {
    secoes.forEach(function (s) { s.classList.add('visivel'); });
    return;
  }
  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (item) {
      if (item.isIntersecting) {
        item.target.classList.add('visivel');
        obs.unobserve(item.target);
      }
    });
  }, { threshold: 0.1 });
  secoes.forEach(function (s) { obs.observe(s); });
}

function iniciarImagens() {
  document.querySelectorAll('figure.imagem img').forEach(function (img) {
    function falhou() { img.closest('figure').classList.add('imagem--falha'); }
    img.addEventListener('error', falhou);
    if (img.complete && img.naturalWidth === 0) { falhou(); }
  });
}

function montarProva() {
  var area = document.getElementById('questoes');
  area.textContent = '';
  QUESTOES.forEach(function (q, i) {
    var campo = criar('fieldset', 'questao');
    campo.appendChild(criar('legend', '', 'Questão ' + (i + 1)));
    campo.appendChild(criar('p', '', q.enunciado));
    q.alternativas.forEach(function (alt, j) {
      var rotulo = criar('label', 'opcao');
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'q' + i;
      radio.value = String(j);
      rotulo.appendChild(radio);
      rotulo.appendChild(criar('span', '', LETRAS[j] + ') ' + alt));
      campo.appendChild(rotulo);
    });
    area.appendChild(campo);
  });
}

function corrigir(evento) {
  evento.preventDefault();
  var aviso = document.getElementById('aviso');
  var respostas = [];
  var faltando = [];

  QUESTOES.forEach(function (q, i) {
    var marcado = document.querySelector('input[name="q' + i + '"]:checked');
    if (marcado) { respostas.push(Number(marcado.value)); }
    else { respostas.push(null); faltando.push(i + 1); }
  });

  if (faltando.length > 0) {
    aviso.textContent = 'Responda todas as questões. Faltam: ' + faltando.join(', ') + '.';
    return;
  }
  aviso.textContent = '';

  var acertos = 0;
  var resultado = document.getElementById('resultado');
  resultado.textContent = '';

  var detalhes = criar('div');
  QUESTOES.forEach(function (q, i) {
    var certa = respostas[i] === q.correta;
    if (certa) { acertos++; }
    var item = criar('div', 'item-resultado ' + (certa ? 'certa' : 'errada'));
    item.appendChild(criar('p', '', 'Questão ' + (i + 1) + ': ' + (certa ? 'acertou' : 'errou')));
    item.appendChild(criar('p', '', 'Sua resposta: ' + LETRAS[respostas[i]] + ') ' + q.alternativas[respostas[i]]));
    item.appendChild(criar('p', '', 'Resposta correta: ' + LETRAS[q.correta] + ') ' + q.alternativas[q.correta]));
    item.appendChild(criar('p', '', q.explicacao));
    detalhes.appendChild(item);
  });

  var nota = (acertos * 10) / QUESTOES.length;
  resultado.appendChild(criar('p', 'nota-final', 'Nota: ' + nota.toFixed(1).replace('.', ',') + ' de 10'));
  resultado.appendChild(criar('p', '', 'Você acertou ' + acertos + ' de ' + QUESTOES.length + ' questões.'));
  resultado.appendChild(detalhes);
  resultado.hidden = false;

  document.getElementById('btnCorrigir').disabled = true;
  document.getElementById('btnRefazer').hidden = false;
  document.querySelectorAll('#formProva input').forEach(function (r) { r.disabled = true; });
  resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function refazer() {
  montarProva();
  var resultado = document.getElementById('resultado');
  resultado.hidden = true;
  resultado.textContent = '';
  document.getElementById('btnCorrigir').disabled = false;
  document.getElementById('btnRefazer').hidden = true;
  document.getElementById('aviso').textContent = '';
  document.getElementById('prova').scrollIntoView({ behavior: 'smooth' });
}

function iniciarProva() {
  var form = document.getElementById('formProva');
  if (!form) { return; }
  montarProva();
  form.addEventListener('submit', corrigir);
  document.getElementById('btnRefazer').addEventListener('click', refazer);
}

document.addEventListener('DOMContentLoaded', function () {
  iniciarMenu();
  iniciarAnimacao();
  iniciarImagens();
  iniciarProva();
});
