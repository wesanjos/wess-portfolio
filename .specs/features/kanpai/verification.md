# Kanpai verification

**Verdict**: FAIL
**Profile**: ui
**Diff range**: eea0e97..2cb90c5 (correção 15cefe1..2cb90c5)
**Round**: 6 - scoped (além do limite de três rodadas; escalar)
**Verifier**: independent sub-agent (author != verifier)

Verificado em 2cb90c5: `npm ci` e `.env` exclusivamente em worktree isolado; build, lint e script de dependências exit 0; Playwright em produção 17/17. O primeiro build, antes da cópia de `.env`, falhou por URL do CMS indefinida; repetido com o ambiente passou, com avisos de lint. Scratch removido e porcelain da árvore principal idêntico ao inicial. Alterações não commitadas da árvore principal, inclusive dependências, não integram esta verificação. Fluxo acompanhado pelo usuário não realizado.

## Binding sources

Abri o HTML vinculante `/home/wess/.t3/userdata/attachments/40e91c6f-f369-40a7-9b55-6f125fb597b7-9def5956-ca93-4140-a71c-a309286e656e-html.html` e os templates extraídos em `/tmp/kanpai`. A avaliação das sete telas e dos estados não alterados é carregada de 15cefe1; reavaliei as mudanças de CSS, fixture, rodapé e ordem visual em 2cb90c5.

| Source | Opened | Contradiction | Uncovered |
| --- | --- | --- | --- |
| Home `176895d1`, tratamentos `16353f52`, massoterapia `abe076a7`, empresas `9579ed60`, sobre `ca9904e8`, blog `b13178e0`, artigo `a4734f07` | sim | nenhuma identificada | Home `#avaliacao`: grade de duas colunas pode renderizar uma coluna sem falhar C7; demais grades não amostradas sofrem a mesma limitação da comparação de CSS computado por instância |
| Menu `36a69b4a` | sim | nenhuma identificada | - |
| Rodapé `631690cc` | sim | nenhuma identificada | -; a lacuna de direção das colunas identificada em 15cefe1 foi corrigida e a mutação correspondente morreu |

## Checks

Provas executadas em 2cb90c5 em uma invocação: `npx playwright test tests/kanpai.spec.js --reporter=list`, todos 17 testes individuais nomeados passaram; `npm run build`, `npm run lint`, `node tests/kanpai-dependencies.cjs` exit 0. `rg -n -C 2 'test\(|expect\(|assert\.' tests/kanpai.spec.js tests/kanpai-dependencies.cjs` localizou provas e expressões. Julgamentos não afetados pela correção são carregados de 15cefe1; referências atualizadas.

| Check | Claim | Proof run | Evidence | Result |
| --- | --- | --- | --- | --- |
| C1 | sete rotas e reload | rotas conhecidas passou | `tests/kanpai.spec.js:66` `expect(response.status(), path).toBe(200)`; `:69` `toContainText(heading)` | PASS |
| C2 | slugs desconhecidos | slugs desconhecidos passou | `tests/kanpai.spec.js:75` `expect((await page.goto(base + path)).status()).toBe(404)` | PASS |
| C3 | menu e rodapé | menu e rodapé passou | `tests/kanpai.spec.js:82,85` `toBeVisible()` | PASS |
| C4 | destinos | links internos passou | `tests/kanpai.spec.js:242` `expect((await request.get(link)).status(), link).toBe(200)` | PASS |
| C5 | home do portfólio | home do portfólio passou | `tests/kanpai.spec.js:277` `expect((await page.goto('/')).status()).toBe(200)` | PASS |
| C6 | metadados | metadados passou | `tests/kanpai.spec.js:293` `expect(description).toBe(expectedDescriptions[path])`; `:285` título específico | PASS |
| C7 | conteúdo e composição | conteúdo da referência passou | `tests/kanpai.spec.js:322` `expectReferenceTree(expected.tree, await elementTree(page.locator('main > *')), ...)`; `:367` `expect(matching.length, ...).toBeGreaterThanOrEqual(count)` | FAIL: grade renderizada pode colapsar sem falhar |
| C8 | larguras | larguras passou | `tests/kanpai.spec.js:170` `toBeLessThanOrEqual(width)`; `:176,188,203` `toEqual([])` | PASS |
| C9 | menu e foco | menu móvel passou | `tests/kanpai.spec.js:215-216` `toHaveAttribute('aria-expanded', 'false')`, `toBeFocused()` | PASS |
| C10 | movimento reduzido | movimento reduzido passou | `tests/kanpai.spec.js:450` `expect(motions.every((duration) => parseFloat(duration) <= (duration.endsWith('ms') ? 0.01 : 0.00001))).toBe(true)` | PASS |
| C11 | demonstração | ações demonstrativas passou | `tests/kanpai.spec.js:466-467` `toContainText('demonstrativa')`, `not.toContainText(/enviado|sucesso/i)` | PASS |
| C12 | imagem | falha de imagem passou | `tests/kanpai.spec.js:502` `expect.poll(() => img.evaluate((element) => element.complete && element.naturalWidth === 0)).toBe(true)`; `:501` alt | PASS para imagem amostrada por tela |
| C13 | CMS | sem CMS passou | `tests/kanpai.spec.js:514` `expect(requests.filter((url) => /datocms/i.test(url))).toEqual([])` | PASS |
| C14 | build e lint | ambos passaram | `npm run build`, `npm run lint` exit 0 | PASS |
| C15 | dependências | script passou | `tests/kanpai-dependencies.cjs:9,13` `assert.deepEqual(added, [])`, `assert.deepEqual(addedDev, [])` | PASS |
| C16 | ordem e teclado | ordem e acesso por teclado passou | `tests/kanpai.spec.js:704` `expect(visualOrder, ...).toEqual([])`; `:725` `expect(focused, ...).toBe(control.index)` | PASS para estados e larguras especificados |

## Coverage

Reavaliado em 2cb90c5 quanto à disposição, rodapé e ordem; rotas e estados não alterados carregados de 15cefe1. A autoridade da disposição são os templates.

| Set (size) | Recomputed from | Member -> proof | Unproven |
| --- | --- | --- | --- |
| Rotas/status (9) | Surface e rotas | sete 200 C1, dois 404 C2 | - |
| Larguras (3) | AC12 | 320, 768, 1440 C8 | - |
| Filtros tratamentos (5), blog (5), programas (4) | templates e `tests/kanpai.spec.js:552` | estados e ações C11 | - |
| Sete telas, menu, rodapé | templates vinculantes | C3 e C7 | grade computada da home em `#avaliacao`; outras instâncias não explicitamente verificadas |
| Teclado (7 telas; 2 larguras) | AC13 e C16 | sete telas em 320 e 1440 C16 | - |
| Portas (3) | Landing | URLs C1, dados locais C13, Playwright C1 | - |

## Test policy rows

Reavaliado em 2cb90c5. Swept: validação C2, falha de imagem C12 e transição C9; demais linhas n/a conforme plano.

| Row | Files it classifies | Required proof | Expectation met |
| --- | --- | --- | --- |
| Rotas e controles | rotas, `src/components/kanpai/index.jsx`, `reference.json` | navegador por rota, estado e destino | sim para estados e percursos especificados |
| Conteúdo e disposição | `reference.json`, `kanpai.module.scss`, cabeçalho e rodapé | comparação independente das sete telas, texto e ordem | não: mutação da grade renderizada da home sobreviveu |

## Faults injected

Em worktree descartável de 2cb90c5, servidor de desenvolvimento e provas estreitas; estado principal comparado antes e após. Mutações de superfícies não tocadas carregadas de 15cefe1: galeria span, destino móvel Blog, aviso de filtro, largura, ordem da marca e tabIndex foram mortas.

| Mutation | Location | Killed |
| --- | --- | --- |
| rodapé Tratamentos `flex-direction: column` → `row` | `src/components/kanpai/reference.json` footer.html | yes: `menu e rodapé` falhou em `tests/kanpai.spec.js:19`; achado anterior corrigido |
| grade de `#avaliacao` da home, `grid-template-columns: 1fr !important` | `src/components/kanpai/kanpai.module.scss` | no: `conteúdo da referência` passou; prova auxiliar confirmou uma única coluna computada `434px`, contra duas colunas `208px 208px` sem mutação |

## Gate

17/17 testes de navegador passaram; build, lint e dependências exit 0. Mutação sobrevivente exige FAIL. `python3 /home/wess/.codex/skills/tlc-spec-lean/scripts/validate_verification.py kanpai`: exit 1, consistente com FAIL. Lição L-009 registrada.
