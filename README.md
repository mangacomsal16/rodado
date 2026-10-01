# Rodado

Adivinhe o craque pela carreira: os escudos dos clubes por onde ele rodou aparecem em ordem e você chuta quem é.

- **Álbum (modo principal):** a carreira inteira aparece de uma vez; acertou, a figurinha é colada. Níveis Fácil, Médio, Difícil, Insano e Lendas.
- **Desafio do dia:** um escudo por vez, 6 chutes, mesmo craque pra todo mundo.

Site estático, sem build: basta abrir o `index.html` ou publicar a pasta (Vercel, Netlify, GitHub Pages…).

> **Versão de teste:** com `MODO_TESTE = true` (no começo do script do `index.html`) o álbum mostra todas as figurinhas liberadas. Troque para `false` antes de publicar pra valer.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | o jogo inteiro (HTML, CSS e JS) |
| `dados.js` | carreiras, clubes e níveis — **gerado**, não edite à mão |
| `escudos/` | escudos dos clubes |
| `favicon.svg` | ícone |
| `ferramentas/gerar-dados.mjs` | script que gera `dados.js` e baixa os escudos |

## Atualizar as carreiras

As carreiras vêm da Wikipedia. Os jogadores ficam na lista `JOGADORES` em `ferramentas/gerar-dados.mjs`, um por linha:

```js
['Título na Wikipedia', 'Nome exibido', OVR, 'POSIÇÃO', 'nível'],
```

- Níveis: `facil`, `medio`, `dificil`, `insano`, `lendas` (lendas = só aposentados).
- Posições: `CA`, `ATA`, `PE`, `PD`, `MEI`, `MC`, `VOL`, `ZAG`, `LE`, `LD`, `GL`, `ME`, `MD`.
- Carta: OVR 90+ preta, 84–89 ouro, até 83 prata; lendas usam a carta sépia.

Depois de editar, rode (Node 18+). Sem `--atualizar` ele só busca jogadores novos; com `--atualizar` busca todas as carreiras de novo:

```bash
node ferramentas/gerar-dados.mjs --atualizar
```

Para corrigir algo que veio errado da Wikipedia (nacionalidade, por exemplo), use `CORRECOES`; para trocar um escudo, `ESCUDOS_MANUAIS`.

## Aviso

Os nomes e referências a clubes de futebol são utilizados exclusivamente para fins de identificação dentro da simulação. Esta plataforma não é afiliada, patrocinada nem endossada pelos clubes mencionados, salvo indicação expressa em contrário.
