let todasClinicas = []; // vai guardar o data.json inteiro

// Inicialização quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  carregarFiltros();
  carregarClinicas();
  configurarSetasNav();
});

// ====================== CARREGAR FILTROS (filtros.json) ======================
// adiciona normalização (remove acentos, pontuação, lower)
function normalize(text) {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

// implementa distância de Levenshtein simples
function levenshtein(a, b) {
  a = a || "";
  b = b || "";
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}


async function carregarFiltros() {
  try {
    const resposta = await fetch("filtros.json");
    const filtros = await resposta.json();

    const ul = document.querySelector("main nav ul");

    filtros.forEach(filtro => {
      const li = document.createElement("li");
      li.textContent = filtro.tipo;
      li.dataset.tipo = filtro.tipo.toLowerCase(); // ex: "pediatra"
      
      li.addEventListener("click", () => {
        filtrarPorTipo(li.dataset.tipo);
        destacarFiltroSelecionado(li);
      });

      ul.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao carregar filtros:", erro);
  }
}

function destacarFiltroSelecionado(liClicado) {
  const itens = document.querySelectorAll("main nav ul li");
  itens.forEach(li => li.classList.remove("ativo"));
  liClicado.classList.add("ativo");
}

// ====================== CARREGAR CLÍNICAS (data.json) ======================

async function carregarClinicas() {
  try {
    const resposta = await fetch("data.json");
    const dados = await resposta.json();
    todasClinicas = dados;
    renderizarCards(todasClinicas);
  } catch (erro) {
    console.error("Erro ao carregar clínicas:", erro);
  }
}

// ====================== RENDERIZAR CARDS ======================

function renderizarCards(lista) {
  const container = document.querySelector(".card-container");
  container.innerHTML = ""; // limpa antes de renderizar

  if (!lista || lista.length === 0) {
    container.innerHTML = "<p style='color:#333;'>Nenhuma clínica encontrada.</p>";
    return;
  }

  lista.forEach(clinica => {
    const article = document.createElement("article");
    article.classList.add("card");

    article.innerHTML = `
      <div class="card-img">
        <img src="./imagens/${clinica.imagem_clinica}" alt="Imagem da clínica ${clinica.nome_clinica}">
      </div>
      <div class="card-info">
        <h2>${clinica.nome_clinica}</h2>
        <p><strong>Bairro / Cidade:</strong> ${clinica.bairro_cidade}</p>
        <p><strong>Endereço:</strong> ${clinica.endereco}</p>
        <p><strong>Horário:</strong> ${clinica.horario_funcionamento}</p>
        <p><strong>Telefone:</strong> ${clinica.telefone}</p>
        <p><strong>Especialidades:</strong> ${clinica.especialidades.join(" · ")}</p>
        <button id="botao-maps" onclick="abrirMaps('${clinica.link_maps}')">Acesse no Mapa</button>
      </div>
    `;

    container.appendChild(article);
  });
}

function abrirMaps(url) {
  window.open(url, "_blank");
}

// ====================== BUSCA PELO INPUT ======================

function iniciarBusca() {
  const input = document.querySelector("header .buscar input");
  const termo = input.value.trim().toLowerCase();

  if (termo === "") {
    renderizarCards(todasClinicas);
    limparDestaqueFiltros();
    return;
  }

  const filtradas = todasClinicas.filter(clinica => {
    const textoGeral = `
      ${clinica.nome_clinica}
      ${clinica.bairro_cidade}
      ${clinica.endereco}
      ${clinica.especialidades.join(" ")}
    `.toLowerCase();

    return textoGeral.includes(termo);
  });

  limparDestaqueFiltros();
  renderizarCards(filtradas);
}

function limparDestaqueFiltros() {
  const itens = document.querySelectorAll("main nav ul li");
  itens.forEach(li => li.classList.remove("ativo"));
}

// Deixa a função acessível pro botão inline
window.iniciarBusca = iniciarBusca;

// ====================== FILTRAR POR TIPO (clique no filtro da nav) ======================

function filtrarPorTipo(tipo) {
  const tipoNorm = normalize(tipo);

  // Mapa opcional de sinônimos (complemente conforme necessário)
  const SYNONYMS = {
    "pediatra": ["pediatria"],
    "dermatologista": ["dermatologia"],
    "cardiologista": ["cardiologia"],
    "ginecologista": ["ginecologia"],
    "ortopedista": ["ortopedia", "ortopedia"],
    "neurologista": ["neurologia"],
    "psicologo": ["psicologia", "psiquiatria"],
    "nutricionista": ["nutrição"],
    "odontologista": ["odontologia"],
    "oftalmologista": ["oftalmologia"],
    "endocrinologista": ["endocrinologia"],
    "urologista": ["urologia"],
    "otorrinolaringologista": ["otorrinolaringologia"],
    "reumatologista": ["reumatologia"],
    "hematologista": ["hematologia"],
    "gastroenterologista": ["gastroenterologia"],
    "nefrologista": ["nefrologia"],
    "pneumologista": ["pneumologia"],
    "radiologista": ["radiologia"],
    "anestesiologista": ["anestesiologia"],
    "cirurgiao": ["cirurgia", "cirurgia geral"],
    "medico de familia": ["clínica médica", "medico de família", "medico de familia"]
  };

  const sinonimos = SYNONYMS[tipoNorm] || [];

  const filtradas = todasClinicas.filter(clinica =>
    clinica.especialidades.some(esp => {
      const espNorm = normalize(esp);

      // correspondência direta / substring
      if (espNorm.includes(tipoNorm) || tipoNorm.includes(espNorm)) return true;

      // sinônimos pré-definidos
      for (const s of sinonimos) {
        const sNorm = normalize(s);
        if (espNorm.includes(sNorm) || sNorm.includes(espNorm)) return true;
      }

      // correspondência por prefixo (primeiros 4 caracteres)
      const prefixLen = 4;
      if (
        espNorm.slice(0, prefixLen) === tipoNorm.slice(0, prefixLen) ||
        tipoNorm.slice(0, prefixLen) === espNorm.slice(0, prefixLen)
      ) return true;

      // distância de Levenshtein pequena (tolerância para variações)
      if (levenshtein(espNorm, tipoNorm) <= 2) return true;

      return false;
    })
  );

  renderizarCards(filtradas);
}  const filtradas = todasClinicas.filter(clinica =>
    clinica.especialidades.some(esp =>
      esp.toLowerCase().includes(tipo) // ex: "pediatria" contém "pediatra"
    )
  );

  renderizarCards(filtradas);



// ====================== SETAS DA NAV (slider) ======================

function configurarSetasNav() {
  const ul = document.querySelector("main nav ul");
  const prev = document.querySelector(".nav-btn.prev");
  const next = document.querySelector(".nav-btn.next");

  if (!ul || !prev || !next) return;

  const slide = 180; // px por clique

  next.addEventListener("click", () => {
    ul.scrollLeft += slide;
  });

  prev.addEventListener("click", () => {
    ul.scrollLeft -= slide;
  });
}
