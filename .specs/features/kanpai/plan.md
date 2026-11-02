# Kanpai — apresentação ao cliente

## Problem

O cliente ainda não pode navegar pela proposta Kanpai dentro do portfólio. A referência reúne sete telas solicitadas, além de menu, rodapé e uma tela de agendamento. Não há métricas de uso ou prazo fornecidos. A entrega permite avaliar a proposta por URL pública e em diferentes tamanhos de tela.

## Flow

Reutilizar o Pages Router, o processo de build e a infraestrutura de hospedagem do portfólio.

1. Visitante acessa uma URL Kanpai → `src/pages` (exists) resolve a página e apresenta seu conteúdo.
2. Visitante aciona navegação, cartões ou controles → `src/pages` (exists) apresenta a rota ou o estado correspondente, mantendo o prefixo Kanpai.
3. Visitante acessa endereço inexistente → `src/pages` (exists) retorna a página 404 do projeto.

## Impact

| Front | What changes |
| --- | --- |
| domínio | Kanpai identifica uma apresentação independente dentro do portfólio, com identidade e navegação próprias. |
| portfólio | Novas páginas compartilham aplicação, estilos globais e metadados existentes; evitar interferência visual e metadados do portfólio nas páginas Kanpai. |
| dados existentes | Nenhuma migração; conteúdo demonstrativo mantido no projeto. |

## Relations

None - nenhuma alteração de dados persistidos.

## Surface

| Route | In | Out | Status |
| --- | --- | --- | --- |
| `GET /projetos/kanpai` | URL | Home | 200 |
| `GET /projetos/kanpai/tratamentos` | URL | hub de tratamentos | 200 |
| `GET /projetos/kanpai/tratamentos/[slug]` | slug conhecido ou desconhecido | tratamento ou página 404 | 200, 404 |
| `GET /projetos/kanpai/empresas` | URL | página B2B | 200 |
| `GET /projetos/kanpai/sobre` | URL | página institucional | 200 |
| `GET /projetos/kanpai/blog` | URL | índice de artigos | 200 |
| `GET /projetos/kanpai/blog/[slug]` | slug conhecido ou desconhecido | artigo ou página 404 | 200, 404 |

## Landing

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| Endereços públicos | `/projetos/kanpai`, `/tratamentos`, `/tratamentos/[slug]`, `/empresas`, `/sobre`, `/blog`, `/blog/[slug]`, com os seis últimos sob `/projetos/kanpai` | Hospedagem separada: não atende ao acesso pelo domínio do portfólio. |
| Testes de navegador | `@playwright/test` como dependência de desenvolvimento para provas de interface. | Apenas lint e build: não exercitam interação e responsividade. |
| Conteúdo de demonstração | Dados locais versionados, com slugs conhecidos e geração estática; desconhecidos retornam 404. | CMS próprio: adiciona dependência e operação não solicitadas para apresentação. |

## Criteria

### S1: Navegação e identidade (P1)

**Acceptance Criteria**

1. The site SHALL apresentar as sete telas nas rotas descritas em Surface.
2. WHEN o visitante acessar uma rota diretamente ou atualizar a página THEN o site SHALL apresentar a tela correspondente.
3. WHEN o visitante acessar slug desconhecido de tratamento ou artigo THEN o site SHALL responder com status 404.
4. The site SHALL apresentar menu e rodapé Kanpai compartilhados nas sete telas.
5. WHEN o visitante acionar um link interno THEN o site SHALL abrir seu destino correspondente sob `/projetos/kanpai`.
6. The site SHALL preservar a home existente do portfólio em `/`.
7. The site SHALL usar título e descrição próprios de cada tela Kanpai, sem metadados sociais do portfólio identificando a página como home pessoal.

**Independent test:** abrir cada rota e navegar entre telas, incluindo acesso direto e slug inexistente.

### S2: Conteúdo e apresentação (P1)

**Acceptance Criteria**

8. The site SHALL reproduzir conteúdo, ordem de seções, identidade visual e disposição das sete telas e dos componentes de menu e rodapé presentes no HTML de referência, adaptando-os a React.
9. The hub SHALL oferecer acesso ao menos à página de detalhes de massoterapia clínica representada na referência.
10. The índice do blog SHALL oferecer acesso ao artigo modelo sobre hérnia de disco representado na referência.
11. The site SHALL apresentar conteúdo de demonstração identificável como tal quando a referência não fornecer informação necessária.
12. The site SHALL manter texto e controles utilizáveis sem rolagem horizontal da página nas larguras de 320, 768 e 1440 CSS pixels.
13. The site SHALL preservar a ordem de leitura e acesso por teclado aos controles interativos nas sete telas.
14. WHEN o menu móvel estiver aberto e o visitante acionar fechar ou Escape THEN o site SHALL fechá-lo e devolver o foco ao acionador.
15. The site SHALL respeitar a preferência de movimento reduzido do sistema para animações introduzidas.

**Independent test:** comparar cada tela com a referência e navegar por teclado nas três larguras.

### S3: Interações e desempenho (P1)

**Acceptance Criteria**

16. WHEN o visitante acionar um controle presente na apresentação THEN o site SHALL executar a ação indicada ou informar claramente que a função é demonstrativa.
17. IF uma imagem de conteúdo não carregar THEN o site SHALL manter seu texto alternativo acessível e a navegação utilizável.
18. The implementação SHALL carregar conteúdo local sem requisição de CMS para as páginas Kanpai.
19. The implementação SHALL evitar dependências de interface adicionais quando os recursos existentes forem suficientes.
20. The build de produção SHALL concluir com sucesso e o lint SHALL concluir sem erros.

**Independent test:** percorrer controles, simular falha de imagem e executar build e lint.

## Out of scope

| Excluded | Why |
| --- | --- |
| Agendamento real, pagamento e envio real de dados | Apresentação ao cliente; integração e destinatários não foram fornecidos. A tela extra de agendamento da referência não integra as sete telas solicitadas. |
| CMS, cadastro e publicação editorial | Conteúdo local atende à demonstração solicitada. |
| Deploy | Publicação depende de autorização explícita e ambiente de hospedagem. |

## Assumptions

| Assumption | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Conteúdo e imagens das demais telas | Reaproveitar o material incorporado ao HTML; indicar lacunas sem inventar informações médicas ou comerciais. | Arquivo contém dez quadros empacotados, incluindo as sete telas solicitadas. | n |
| Contato e agendamento | Controles sem destino real exibem indicação de demonstração; não simular envio bem-sucedido. | Nenhum contato ou integração confirmado. | n |
| Acesso à apresentação | Público, sem autenticação, após publicação autorizada. | URL solicitada como acessível pelo site. | n |

**Open questions:** none - decisões pendentes registradas como pressupostos para revisão.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| sete telas | conteúdo, ordem e densidade | AC 8, 11, 12 |
| sete telas | carregamento e vazio | n/a - conteúdo local pré-renderizado, sem busca ou coleção remota |
| sete telas | erro | AC 3, 17 |
| sete telas | não autorizado | n/a - apresentação pública sem autenticação |
| sete telas | ação destrutiva | n/a - nenhuma alteração de dados |
| menu e controles | navegação, foco e ações | AC 5, 13, 14, 16 |
| conteúdo editorial | estrutura, tom e próximo passo | AC 8, 10, 11 |
| coleções de tratamentos e artigos | agrupamento e ordem | AC 8, 9, 10 |
| coleções | duplicatas e exceções | n/a - conjunto local demonstrativo, sem criação pelo visitante |

## Sources

- Solicitação do usuário — sete telas, rota no portfólio, responsividade e apresentação funcional.
- `Kanpai — Relayout Home (1).html` fornecido pelo usuário — referência vinculante de conteúdo e layout; contém também agendamento fora do escopo solicitado.
- [Next.js Pages Router: getStaticPaths](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths) — rotas dinâmicas geradas estaticamente e comportamento de 404.
