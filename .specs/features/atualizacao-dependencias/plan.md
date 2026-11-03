# Atualização de dependências e organização

## Problem

O portfólio usa dependências antigas, dois arquivos de lock e configuração de ferramentas defasada. Isso dificulta instalações reproduzíveis e manutenção; a auditoria do lock npm identificou 17 pacotes com alertas. A aplicação depende do DatoCMS na geração da página, sem instruções locais suficientes para reproduzir o build. Não há medição de impacto em produção.

A atualização deve preservar a experiência do portfólio e tornar instalação, validação e manutenção reproduzíveis.

## Flow

O trabalho reutiliza o Pages Router, a integração existente com DatoCMS e os comandos npm do projeto.

1. `package.json` (exists) e `package-lock.json` (exists) definem dependências e instalação reproduzível; `README.md` (exists) orienta o ambiente.
2. `src/pages/index.jsx` (exists) consulta `src/infra/cms/cmsService.js` (exists) durante o build e entrega conteúdo ao renderizador existente.
3. `src/infra/cms/CMSSectionRender.js` (exists) e os componentes existentes exibem conteúdo, imagens, links e animações.
4. `next.config.js` (exists), `.eslintrc.json` (exists) e scripts em `package.json` (exists) sustentam compilação e verificações; sua forma pode mudar conforme compatibilidade.

## Impact

| Front           | What changes                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| dependências    | Versões diretas e transitivas, compatibilidade entre Next, React, DatoCMS, Sass e ferramentas.       |
| desenvolvimento | Node, instalação, lint, formatação e instruções de execução passam a ser reproduzíveis.              |
| publicação      | Build depende de endpoint e credencial DatoCMS; versão de Node da hospedagem precisa ser confirmada. |
| stored data     | Nenhuma migração de conteúdo DatoCMS prevista.                                                       |
| domain          | Nenhuma mudança de significado de termos existente.                                                  |

## Relations

None - nenhuma mudança no formato de dados persistidos.

## Surface

None - nenhuma rota nova ou alteração de assinatura externa prevista.

## Landing

| One-way door                | Literal shape                                          | Alternative rejected                                       |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| Gerenciador de dependências | npm com `package-lock.json` como único lock versionado | Manter também `yarn.lock`: permite resoluções divergentes. |

## Criteria

### S1: Instalação e segurança (P1)

**Acceptance Criteria**

1. The repositório SHALL manter `package-lock.json` como único arquivo de lock de gerenciador de pacotes versionado.
2. WHEN executada uma instalação limpa com a versão de Node documentada THEN o projeto SHALL instalar usando `npm ci` com saída 0.
3. The dependências diretas SHALL ter versões estáveis atuais compatíveis entre si no momento da implementação, ou uma justificativa documentada para cada exceção.
4. WHEN executada a auditoria npm no lock atualizado THEN o resultado SHALL conter zero alertas críticos e altos sem justificativa documentada de exposição, correção e acompanhamento.

**Independent test:** instalar em ambiente limpo e revisar versões e relatório de auditoria.

### S2: Portfólio funcional (P1)

**Acceptance Criteria**

5. WHEN executado o build com `BASE_ENDPOINT` e `DATO_TOKEN` válidos THEN o comando SHALL terminar com saída 0.
6. WHEN a página inicial for gerada com conteúdo DatoCMS válido THEN SHALL exibir cabeçalho, apresentação, projetos, projetos adicionais e rodapé conforme conteúdo existente.
7. WHEN imagens e links presentes no conteúdo forem renderizados THEN SHALL manter seus destinos e fontes correspondentes ao conteúdo fornecido.
8. WHEN a lista de projetos contiver zero, um ou vários itens THEN a página SHALL renderizar sem erro de execução.
9. WHEN a página for visualizada em largura desktop e móvel THEN a navegação e o conteúdo SHALL permanecer utilizáveis e a animação desktop SHALL funcionar sem erros de execução.
10. IF o CMS retornar erro HTTP ou erro GraphQL durante o build THEN o build SHALL falhar com mensagem diagnóstica sem expor o token.

**Independent test:** executar build com dados válidos e falhas controladas; verificar página e animação em ambos os tamanhos.

### S3: Manutenção (P2)

**Acceptance Criteria**

11. WHEN executados os comandos documentados de lint e verificação de formatação THEN cada comando SHALL terminar com saída 0.
12. The README SHALL documentar versão de Node, instalação, variáveis necessárias sem valores secretos, desenvolvimento, build e validação.
13. The configuração de lint SHALL verificar imports não resolvidos e variáveis não usadas sem desativação global dessas regras.

**Independent test:** seguir o README em instalação limpa e executar os comandos documentados.

## Out of scope

| Excluded                          | Why                                                                    |
| --------------------------------- | ---------------------------------------------------------------------- |
| Redesenho visual ou conteúdo novo | Atualização preserva a experiência existente.                          |
| Migração para App Router          | Atualização de dependências não exige mudança de arquitetura de rotas. |
| Alterações de dados no DatoCMS    | Nenhuma mudança de conteúdo foi solicitada.                            |

## Assumptions

| Assumption                   | Chosen default                                                                          | Rationale                                               | Confirmed? |
| ---------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| Hospedagem e Node disponível | Selecionar versão LTS compatível com dependências e confirmar no ambiente de publicação | Ambiente de produção não foi identificado.              | n          |
| Dados e acesso ao CMS        | Usar credenciais existentes quando disponíveis e respostas controladas para falhas      | Credenciais não foram fornecidas nesta etapa.           | n          |
| Perfil de verificação        | light                                                                                   | Padrão da skill na ausência de configuração do projeto. | n          |

**Open questions:** disponibilidade de credenciais e ambiente de publicação: blocks go-live; build real exige acesso válido ao CMS.

## Observable

| Surface                 | Decision                            | Landing                                                           |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| página inicial          | conteúdo e ordem                    | AC 6, AC 7                                                        |
| página inicial          | lista vazia e um item               | AC 8                                                              |
| página inicial          | carregamento, erro e não autorizado | existing - geração estática; falha de CMS tratada no build, AC 10 |
| página inicial          | ação destrutiva                     | n/a - não há ação destrutiva                                      |
| comandos                | saída, falhas e resultado           | AC 2, AC 5, AC 10, AC 11                                          |
| comandos                | flags e padrões novos               | n/a - nenhum novo contrato de flags previsto                      |
| documentação            | estrutura e próximo passo           | AC 12                                                             |
| coleção de dependências | duplicatas e organização            | AC 1, AC 3                                                        |

## Sources

- Solicitação do usuário nesta conversa: atualizar dependências e organizar o projeto preservando a etapa de revisão do plano.
- `package.json` e `package-lock.json`: dependências e versões atuais.
