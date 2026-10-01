# Rodado

Adivinhe o craque pela carreira: os escudos dos clubes por onde ele rodou aparecem em ordem e você chuta quem é.

- **Álbum (modo principal):** a carreira inteira aparece de uma vez; acertou, a figurinha é colada. Níveis Fácil, Médio, Difícil, Insano e Lendas.
- **Desafio do dia:** um escudo por vez, 6 chutes, mesmo craque pra todo mundo.

Site estático, sem build: basta abrir o `index.html` ou publicar a pasta (Vercel, Netlify, GitHub Pages…).

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | o jogo inteiro (HTML, CSS e JS) |
| `dados.js` | carreiras, clubes e níveis — **gerado**, não edite à mão |
| `escudos/` | escudos dos clubes |
| `favicon.svg` | ícone |
| `ferramentas/gerar-dados.mjs` | script que gera `dados.js` e baixa os escudos |

## Atualizar as carreiras

As carreiras vêm da Wikipedia. Para incluir/remover jogadores, edite as listas `TOP`, `LENDAS` e `ETERNOS` em `ferramentas/gerar-dados.mjs` e rode (Node 18+):

```bash
node ferramentas/gerar-dados.mjs --atualizar
```

Para mudar um jogador de nível, use `CORRECOES` no mesmo arquivo, ex.: `'bremer': { nivel:'dificil' }`.

## Aviso

Os nomes e referências a clubes de futebol são utilizados exclusivamente para fins de identificação dentro da simulação. Esta plataforma não é afiliada, patrocinada nem endossada pelos clubes mencionados, salvo indicação expressa em contrário.
