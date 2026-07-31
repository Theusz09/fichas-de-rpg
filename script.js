// ============ configuração ============
const ATTR_MAX = 15;
const ATTRS = [
  ["forca", "força"],
  ["mira", "mira"],
  ["defesa", "defesa"],
  ["velocidade", "velocidade"],
  ["furtividade", "furtividade"],
  ["medicina", "medicina"],
  ["percepcao", "percepção"],
  ["intuicao", "intuição"],
  ["investigacao", "investigação"],
  ["inteligencia", "inteligência"],
  ["tecnologia", "tecnologia"],
];
const STORAGE_KEY = "dossie_fichas_v1";

// ============ estado ============
let fichas = [];
let fichaAtualId = null;

function novaFichaVazia(nome = "nova ficha") {
  const attrs = {};
  ATTRS.forEach(([key]) => (attrs[key] = 0));
  return {
    id: crypto.randomUUID(),
    jogador: "",
    nome: nome,
    idade: "",
    pronomes: "",
    ocupacao: "",
    historia: "",
    attrs,
    vidaAtual: 0, vidaMax: 0,
    sanidadeAtual: 0, sanidadeMax: 0,
    sorte: 0,
    invAtual: 0, invMax: 7,
    imagens: [],
  };
}

function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    fichas = raw ? JSON.parse(raw) : [];
  } catch (e) {
    fichas = [];
  }
  if (fichas.length === 0) {
    fichas.push(novaFichaVazia("minha primeira ficha"));
  }
  fichaAtualId = fichas[0].id;
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
  const status = document.getElementById("saveStatus");
  status.textContent = "registrado ⛧ " + new Date().toLocaleTimeString("pt-BR");
  status.style.color = "var(--rose)";
  setTimeout(() => {
    status.textContent = "tudo salvo... por enquanto ⛧";
    status.style.color = "";
  }, 1400);
}

function fichaAtual() {
  return fichas.find((f) => f.id === fichaAtualId);
}

// ============ render: seletor de fichas ============
function renderSelect() {
  const sel = document.getElementById("fichaSelect");
  sel.innerHTML = "";
  fichas.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.nome || "(sem nome)";
    if (f.id === fichaAtualId) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ============ render: atributos ============
function renderAttrs() {
  const grid = document.getElementById("attrsGrid");
  grid.innerHTML = "";
  const f = fichaAtual();

  ATTRS.forEach(([key, label]) => {
    const val = f.attrs[key] ?? 0;
    const row = document.createElement("div");
    row.className = "attr-row";
    row.innerHTML = `
      <div class="attr-head">
        <span class="attr-name">${label}</span>
        <div class="attr-controls">
          <button class="attr-btn" data-dec="${key}">−</button>
          <input class="attr-value" type="text" inputmode="numeric" data-attr="${key}" value="${val}">
          <button class="attr-btn" data-inc="${key}">+</button>
        </div>
      </div>
      <div class="segments">
        ${Array.from({ length: ATTR_MAX })
          .map((_, i) => `<div class="segment ${i < val ? "filled" : ""}"></div>`)
          .join("")}
      </div>
    `;
    grid.appendChild(row);
  });

  grid.querySelectorAll("[data-inc]").forEach((btn) =>
    btn.addEventListener("click", () => alterarAttr(btn.dataset.inc, 1))
  );
  grid.querySelectorAll("[data-dec]").forEach((btn) =>
    btn.addEventListener("click", () => alterarAttr(btn.dataset.dec, -1))
  );
  grid.querySelectorAll("[data-attr]").forEach((input) =>
    input.addEventListener("change", () => {
      const n = clamp(parseInt(input.value) || 0, 0, ATTR_MAX);
      fichaAtual().attrs[input.dataset.attr] = n;
      salvar();
      renderAttrs();
    })
  );
}

function alterarAttr(key, delta) {
  const f = fichaAtual();
  f.attrs[key] = clamp((f.attrs[key] ?? 0) + delta, 0, ATTR_MAX);
  salvar();
  renderAttrs();
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// ============ render: recursos ============
function renderRecursos() {
  const f = fichaAtual();

  document.querySelector('[data-field="vidaAtual"]').value = f.vidaAtual;
  document.querySelector('[data-field="vidaMax"]').value = f.vidaMax;
  document.querySelector('[data-field="sanidadeAtual"]').value = f.sanidadeAtual;
  document.querySelector('[data-field="sanidadeMax"]').value = f.sanidadeMax;
  document.querySelector('[data-field="sorte"]').value = f.sorte;
  document.querySelector('[data-field="invAtual"]').value = f.invAtual;
  document.querySelector('[data-field="invMax"]').value = f.invMax;

  const vidaPct = f.vidaMax > 0 ? clamp((f.vidaAtual / f.vidaMax) * 100, 0, 100) : 0;
  const sanPct = f.sanidadeMax > 0 ? clamp((f.sanidadeAtual / f.sanidadeMax) * 100, 0, 100) : 0;
  document.querySelector('[data-meter="vida"]').style.width = vidaPct + "%";
  document.querySelector('[data-meter="sanidade"]').style.width = sanPct + "%";

  const slotsWrap = document.getElementById("invSlots");
  slotsWrap.innerHTML = "";
  const max = clamp(f.invMax, 0, 60);
  for (let i = 0; i < max; i++) {
    const s = document.createElement("div");
    s.className = "slot" + (i < f.invAtual ? " filled" : "");
    slotsWrap.appendChild(s);
  }
}

// ============ render: galeria ============
function renderGaleria() {
  const f = fichaAtual();
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  f.imagens.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = "polaroid";
    div.style.setProperty("--tilt", (i % 2 === 0 ? -1 : 1) * (2 + (i % 3)) + "deg");
    div.innerHTML = `
      <img src="${src}" alt="aparência do personagem">
      <button class="remove" data-remove-img="${i}" title="remover imagem">×</button>
    `;
    gallery.appendChild(div);
  });
  gallery.querySelectorAll("[data-remove-img]").forEach((btn) =>
    btn.addEventListener("click", () => {
      f.imagens.splice(parseInt(btn.dataset.removeImg), 1);
      salvar();
      renderGaleria();
    })
  );
}

// ============ render: campos de texto simples ============
function renderCamposTexto() {
  const f = fichaAtual();
  document.querySelectorAll("[data-field]").forEach((input) => {
    const key = input.dataset.field;
    if (key in f) input.value = f[key];
  });
}

function renderTudo() {
  renderSelect();
  renderCamposTexto();
  renderAttrs();
  renderRecursos();
  renderGaleria();
}

// ============ eventos: campos de texto/número simples ============
document.addEventListener("input", (e) => {
  const el = e.target;
  if (!el.dataset.field) return;
  const f = fichaAtual();
  const key = el.dataset.field;
  const isNumber = el.type === "number";
  f[key] = isNumber ? parseInt(el.value) || 0 : el.value;

  if (["vidaAtual", "vidaMax", "sanidadeAtual", "sanidadeMax", "invAtual", "invMax"].includes(key)) {
    renderRecursos();
  }
  if (key === "nome") renderSelect();
});

document.addEventListener("change", (e) => {
  if (e.target.dataset.field) salvar();
});

// ============ eventos: topbar ============
document.getElementById("fichaSelect").addEventListener("change", (e) => {
  fichaAtualId = e.target.value;
  renderTudo();
});

document.getElementById("btnNova").addEventListener("click", () => {
  const nome = prompt("nome da nova ficha:", "personagem sem nome");
  if (nome === null) return;
  const nova = novaFichaVazia(nome || "sem nome");
  fichas.push(nova);
  fichaAtualId = nova.id;
  salvar();
  renderTudo();
});

document.getElementById("btnDuplicar").addEventListener("click", () => {
  const f = fichaAtual();
  const copia = JSON.parse(JSON.stringify(f));
  copia.id = crypto.randomUUID();
  copia.nome = f.nome + " (cópia)";
  fichas.push(copia);
  fichaAtualId = copia.id;
  salvar();
  renderTudo();
});

document.getElementById("btnExcluir").addEventListener("click", () => {
  if (fichas.length === 1) {
    alert("não é possível excluir a única ficha existente.");
    return;
  }
  if (!confirm(`excluir a ficha "${fichaAtual().nome}"? esta ação não pode ser desfeita.`)) return;
  fichas = fichas.filter((f) => f.id !== fichaAtualId);
  fichaAtualId = fichas[0].id;
  salvar();
  renderTudo();
});

document.getElementById("btnExportJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(fichas, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fichas-rpg.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importJson").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importadas = JSON.parse(reader.result);
      if (!Array.isArray(importadas)) throw new Error("formato inválido");
      importadas.forEach((f) => {
        f.id = crypto.randomUUID(); // evita colisão com fichas existentes
      });
      fichas = fichas.concat(importadas);
      fichaAtualId = importadas[0]?.id || fichaAtualId;
      salvar();
      renderTudo();
      alert("fichas importadas com sucesso.");
    } catch (err) {
      alert("não foi possível importar este arquivo. verifique se é um .json exportado por este site.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("btnImprimir").addEventListener("click", () => window.print());

// ============ eventos: upload de imagens ============
document.getElementById("imgInput").addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  const f = fichaAtual();
  let pendentes = files.length;
  if (pendentes === 0) return;

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      f.imagens.push(reader.result);
      pendentes--;
      if (pendentes === 0) {
        salvar();
        renderGaleria();
      }
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});

// ============ música ambiente ============
const MUSIC_PREF_KEY = "dossie_musica_ligada";
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

bgMusic.volume = 0.35;

function setMusicState(tocando) {
  musicToggle.classList.toggle("playing", tocando);
  musicToggle.setAttribute("aria-pressed", String(tocando));
  musicToggle.querySelector(".music-label").textContent = tocando ? "pausar" : "música";
  localStorage.setItem(MUSIC_PREF_KEY, tocando ? "1" : "0");
}

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {
      alert("não foi possível tocar o áudio. verifique se o arquivo assets/musica.mp3 existe no site.");
    });
    setMusicState(true);
  } else {
    bgMusic.pause();
    setMusicState(false);
  }
});

// tenta retomar a música automaticamente se o visitante já tinha deixado ligada
// (o navegador só permite isso após alguma interação na página)
if (localStorage.getItem(MUSIC_PREF_KEY) === "1") {
  const tentarRetomar = () => {
    bgMusic.play().then(() => setMusicState(true)).catch(() => {});
    document.removeEventListener("click", tentarRetomar);
    document.removeEventListener("keydown", tentarRetomar);
  };
  document.addEventListener("click", tentarRetomar, { once: true });
  document.addEventListener("keydown", tentarRetomar, { once: true });
}

// ============ start ============
carregar();
renderTudo();
