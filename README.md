# CodeReview AI

CodeReview AI é uma ferramenta simples para revisar pequenos trechos de código com ajuda do Gemini. A ideia é colar um snippet, escolher a linguagem, escolher se você quer uma revisão rápida ou mais completa, e receber uma análise em tempo real com bugs, riscos, sugestões de refatoração, boas práticas e também o que está bom no código.

Eu fiz este projeto com foco em portfólio, então ele não tenta parecer maior do que é. Não tem login, não guarda histórico, não cria projeto no GitHub e não tenta substituir revisão humana. Ele resolve um problema pequeno de um jeito bem acabado: entrada clara, validação, streaming, limite de uso, markdown renderizado e documentação curta para qualquer pessoa rodar sem precisar adivinhar o próximo passo.

Para rodar localmente, entre na pasta do projeto e instale as dependências com `npm install`. Depois crie um arquivo `.env.local` copiando o conteúdo de `.env.example` e preenchendo as três variáveis. A `GOOGLE_GENERATIVE_AI_API_KEY` é a chave do Google AI Studio usada para chamar o Gemini. `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` vêm do Redis da Upstash e são usados para limitar o uso por IP. Sem essas variáveis, o build ainda funciona, mas a rota real de revisão não consegue operar em produção.

Depois das variáveis configuradas, rode `npm run dev` e abra `http://localhost:3000`. Cole um trecho de código, escolha a linguagem e clique em revisar. O atalho `Ctrl + Enter` também dispara a revisão. Em macOS, `Command + Enter` funciona pelo mesmo caminho.

Os comandos principais são poucos. `npm run dev` inicia o ambiente local. `npm run lint` verifica problemas de lint. `npm test` roda os testes automatizados dos helpers e da rota. `npm run build` gera a versão de produção e também checa tipos. Antes de publicar, rode pelo menos lint, test e build.

O deploy natural é na Vercel, porque o projeto usa Next.js App Router e uma rota Edge para streaming. No painel da Vercel, configure as mesmas variáveis do `.env.example`. Depois disso, o deploy deve funcionar sem adaptação extra.

Uma observação importante: o modo rápido e o modo completo usam o mesmo modelo base, `gemini-2.5-flash`, mas com limites de resposta diferentes. Preferi essa decisão porque ele tem free tier oficial, boa velocidade e qualidade suficiente para revisão de código. Quando você quiser evoluir o projeto, o lugar certo para trocar ou adicionar modelos é `lib/models.ts`.

Este projeto foi pensado para ser fácil de revisar no GitHub. A regra de revisão fica em `lib/prompts.ts`, a validação em `lib/validation.ts`, o rate limit em `lib/rate-limit.ts`, a rota em `app/api/review/route.ts` e a interface em componentes pequenos dentro de `components/`. Se alguém abrir o código, não precisa caçar regra de negócio espalhada em arquivo gigante.
