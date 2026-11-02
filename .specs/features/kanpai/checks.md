# Kanpai checks

Profile: ui
Plan: `.specs/features/kanpai/plan.md`

## Checks

### S1 - Navegação e identidade

**C1** - As sete rotas conhecidas retornam 200 e a página correspondente (AC 1, 2). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'rotas conhecidas'`

**C2** - Os slugs desconhecidos de tratamento e artigo retornam 404 (AC 3). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'slugs desconhecidos'`

**C3** - As sete telas apresentam menu e rodapé Kanpai (AC 4). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'menu e rodapé'`

**C4** - Links internos levam a rotas Kanpai válidas (AC 5, 9, 10). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'links internos'`

**C5** - A home do portfólio continua acessível (AC 6). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'home do portfólio'`

**C6** - Cada tela apresenta título e descrição próprios e sem metadados sociais do portfólio (AC 7). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'metadados'`

### S2 - Apresentação

**C7** - As sete telas preservam texto e ordem das seções da referência (AC 8, 11). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'conteúdo da referência'`

**C8** - As sete telas não apresentam rolagem horizontal em 320, 768 e 1440 pixels (AC 12). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'larguras'`

**C9** - O menu móvel abre pelo teclado e fecha com Escape, devolvendo foco (AC 13, 14). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'menu móvel'`

**C10** - Animações respeitam movimento reduzido (AC 15). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'movimento reduzido'`

### S3 - Interações e build

**C11** - Controles demonstrativos informam indisponibilidade sem alegar envio (AC 16). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'ações demonstrativas'`

**C12** - Falha de imagem mantém alternativa textual e navegação (AC 17). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'falha de imagem'`

**C13** - Páginas Kanpai não requisitam o CMS (AC 18). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'sem CMS'`

**C14** - Build e lint terminam sem erro (AC 20). ✅
Proof: `npm run build`
Proof: `npm run lint`

**C15** - Páginas não adicionam dependência de interface (AC 19). ✅
Proof: `node tests/kanpai-dependencies.cjs`

**C16** - Nas sete telas, controles visíveis seguem a ordem de leitura ao usar Tab em 320 e 1440 pixels, incluindo menus móveis e conteúdo de acordeões (AC 13). ✅
Proof: `npx playwright test tests/kanpai.spec.js -g 'ordem e acesso por teclado'`

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /projetos/kanpai` statuses (1) | 200 C1 | - |
| `GET /projetos/kanpai/tratamentos` statuses (1) | 200 C1 | - |
| `GET /projetos/kanpai/tratamentos/[slug]` statuses (2) | 200 C1 · 404 C2 | - |
| `GET /projetos/kanpai/empresas` statuses (1) | 200 C1 | - |
| `GET /projetos/kanpai/sobre` statuses (1) | 200 C1 | - |
| `GET /projetos/kanpai/blog` statuses (1) | 200 C1 | - |
| `GET /projetos/kanpai/blog/[slug]` statuses (2) | 200 C1 · 404 C2 | - |
| Portas (3) | URLs C1 · dados locais C13 · Playwright C1 | - |
| Teclado (7) | home C16 · tratamentos C16 · massoterapia C16 · empresas C16 · sobre C16 · blog C16 · artigo C16 | - |

## Test policy

| Code | Required proofs | Coverage expectation |
| --- | --- | --- |
| Rotas e controles | navegador no limite público | cada rota, estado e destino descrito |
| Conteúdo e disposição | comparação independente com referência vinculante | sete telas, texto e ordem de seções |

Evidência: repositório não possui suíte de testes anterior; custo: testes de navegador e revisão independente das sete telas.

## Swept

- validation: C2
- failure modes: C12
- idempotency: n/a - sem gravações
- authorization: n/a - acesso público
- concurrency: n/a - sem estado compartilhado persistido
- data lifecycle: n/a - conteúdo estático
- dependency failure: C12
- state transitions: C9
- observability: n/a - sem requisito de telemetria

## Handoff

Referência: sete templates descompactados com aproximadamente 265 KB; código existente relevante 4 KB; estimativa conservadora 269 KB / 4 = 67,25k tokens, abaixo do orçamento 150k. Um executor.
