# Alerta Dengue UDI

> Plataforma web full stack para prevenção à dengue em Uberlândia-MG. Combina dados climáticos em tempo real, mapa interativo dos bairros, notificações automáticas (email e push) e diagnóstico educativo de sintomas.

Construída como projeto pessoal, com foco em qualidade de código, arquitetura limpa, segurança de produção e experiência do usuário em mobile e desktop.

<p align="center">
  <img src="docs/screenshots/pagina-principal.png" width="280" alt="Dashboard principal do Alerta Dengue UDI" />
</p>

---

## Acesse

- **Aplicação**: <https://alerta-dengue-udi-frontend.vercel.app>
- **API**: <https://alerta-dengue-udi-api.onrender.com>

> A primeira requisição após inatividade pode demorar até 30 segundos enquanto o backend acorda.

---

## Demo

<p align="center">
  <img src="docs/screenshots/onboarding-localizacao.png" width="220" alt="Onboarding com geolocalização automática" />
  <img src="docs/screenshots/onboarding-notificacoes.png" width="220" alt="Onboarding com toggles independentes de push e email" />
  <img src="docs/screenshots/modal-preferencias.png" width="220" alt="Modal de preferências com botões de teste" />
  <img src="docs/screenshots/modal-postos-proximos.png" width="220" alt="Modal de postos de saúde próximos" />
</p>

---

## Sobre o projeto

A dengue é um problema de saúde pública sazonal em Uberlândia. O Aedes aegypti se prolifera mais em períodos de chuva combinada com temperatura alta e umidade. A plataforma usa essas variáveis para **gerar alertas preventivos automáticos** por bairro, ajudando moradores a agir antes do mosquito se estabelecer.

Tudo funciona sem cadastro tradicional — a identificação é por um ID anônimo gerado no navegador, salvo localmente, e reaproveitado entre sessões.

---

## Funcionalidades

### Mapa interativo da cidade

- Mapa de Uberlândia centrado na malha urbana, com limite geográfico que impede arrastar para fora.
- Bairro selecionado destacado em vermelho, usando GeoJSON oficial da prefeitura.
- Pinos de unidades de saúde com popup de informações (endereço, telefone, tipo, distância).
- Zoom controlado por `Ctrl + scroll` para não interferir na rolagem da página.

### Onboarding em 4 etapas

- Boas-vindas → seleção de bairro (manual ou via geolocalização) → preferências de notificação (push e email independentes) → confirmação.
- Persistência local sem necessidade de cadastro.
- Detecção do tipo de dispositivo (mobile vs desktop) para habilitar features específicas (push e geolocalização ficam exclusivas para mobile).

### Localização automática (mobile)

- Toggle "Permitir geolocalização" no onboarding e nas preferências (somente mobile).
- Quando ativo, o bairro do usuário é **detectado automaticamente** via ponto-em-polígono sobre o GeoJSON da cidade.
- O select manual de bairro é bloqueado enquanto a localização estiver ativa, para evitar ambiguidade.
- Preferência persistida no localStorage com sincronização reativa entre componentes.

### Alertas preventivos baseados em clima

Quatro regras avaliadas a cada 30 minutos pelo scheduler interno:

| Regra | Disparo |
|---|---|
| `RAIN_AND_RECENT_WATER` | Chuva prevista hoje **e** acúmulo recente nos últimos 3 dias |
| `RAIN_EXPECTED_TODAY` | Probabilidade de chuva ≥ 50% para hoje |
| `RECENT_RAIN_DETECTED` | Acúmulo de chuva ≥ 8mm nos últimos 3 dias |
| `WARM_AND_HUMID_NOW` | Temperatura ≥ 27°C e umidade ≥ 70% |

Quando uma regra dispara para um bairro, todos os usuários cadastrados nele recebem alertas pelos canais que tiverem habilitado.

### Notificações automáticas

- **Email** via EmailJS, com template HTML responsivo mostrando bairro, probabilidade de chuva e acúmulo recente.
- **Push** via Web Push API (VAPID) para dispositivos com PWA instalado.
- Dedup por janela diária: cada destinatário (email) ou device (push) recebe no máximo uma notificação por regra por dia.
- Log estruturado de todas as tentativas (`ClimateNotificationLog`) com status, motivo e metadata.
- Limpeza automática de subscriptions expiradas (HTTP 404/410 do provider).

<p align="center">
  <img src="docs/screenshots/notificacoes.jpeg" width="280" alt="Notificações de email e push reais chegando no celular" />
</p>

### Botões de teste no menu de preferências

Para o recrutador validar o pipeline sem esperar uma chuva real:

- **Email de teste**: envia imediatamente um email com o template climático e dados reais do bairro.
- **Push de teste (15s)**: agenda push para chegar 15 segundos depois, dando tempo de fechar o app/bloquear a tela.

### Diagnóstico virtual

- Checklist de sintomas compatíveis com dengue (febre, cefaleia, dor retro-orbital, mialgia, etc).
- Classificação educativa por nível de atenção, com recomendação clara de procurar atendimento.
- Avisos explícitos de que a ferramenta é educativa e não substitui avaliação médica.

### Unidades de saúde próximas

- Base própria de unidades carregadas no banco a partir de fontes oficiais (UAI, UBS, hospitais, CAPS, etc).
- Recomendação ordenada por distância quando a geolocalização está ativa.
- Fallback ordenado por bairro quando a localização não está disponível.
- Botões diretos para abrir rotas no Google Maps e ligar para a unidade.

### PWA completo

- `manifest.webmanifest` com identidade visual.
- Service Worker (`push-sw.js`) para receber e exibir notificações com app fechado.
- Suporte a "Adicionar à Tela de Início" no iOS Safari (16.4+) com push funcional.
- Layout respeita `safe-area-inset-top` para não esconder a navbar atrás do notch / Dynamic Island do iPhone.

---

## Stack

### Frontend

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** (com design tokens via `@theme`)
- **React Router 7** para roteamento
- **Leaflet** + **react-leaflet** para o mapa (carregado via lazy loading)
- **Font Awesome** para iconografia

### Backend

- **Node.js 22** + **TypeScript**
- **Express 5** com middlewares de segurança (`helmet`, `cors`, `express-rate-limit`)
- **Prisma 7** + **PostgreSQL** com migrations versionadas
- **Pino** + `pino-http` para logs estruturados em JSON
- **Zod** para validação de entrada com mensagens tipadas
- **web-push** para entrega de notificações via VAPID
- **Vitest** para testes unitários

### Integrações externas

- **Open-Meteo** — dados climáticos atualizados (sem API key)
- **EmailJS** — entrega de emails transacionais
- **Web Push API** — notificações nativas do navegador/sistema

### Infraestrutura

- **Render** — backend (Web Service) + PostgreSQL
- **Vercel** — frontend estático com edge cache
- **GitHub Actions** — CI rodando typecheck, testes, lint e build em cada PR

---

## Arquitetura

### Decisões de design

- **Sem login tradicional**: cada device tem um `anonymousId` (UUID gerado no localStorage). Suficiente para o caso de uso, sem fricção de cadastro.
- **SOLID + clean code**: services com responsabilidade única, hooks customizados, validações em camada própria.
- **Type safety end-to-end**: tipos do Prisma propagam para os services; `apiClient` tipado no frontend; zod no backend valida na borda.
- **Logger estruturado**: pino emite JSON em produção (compatível com agregadores) e formato legível em dev.
- **Rate limiting por endpoint**: políticas diferentes para automação (300/15min), envio de teste (5/h), push subscription (10/15min) e diagnóstico (30/15min).
- **Endpoint de automação protegido**: requer header `x-automation-secret` validado com `timingSafeEqual` (resistente a timing attacks).
- **CORS configurável**: aceita lista de origens com suporte a wildcards de subdomínio (`.vercel.app`); recusa subir em produção com `*`.
- **Code splitting**: o `MapCanvas` (Leaflet ~150kB) é lazy-loaded — bundle inicial cai 30%.

### Fluxo de notificação climática

```
[Scheduler interno - cada 30min]
    ↓
[Carrega UserPreferences ativas]
    ↓
[Agrupa por bairro]
    ↓
[Para cada bairro: busca clima no Open-Meteo]
    ↓
[Avalia regras (weatherSignals → rule)]
    ↓
[Para cada usuário do bairro:]
    ├─ Email: EmailJS (com dedup por destinatário+dia+regra)
    └─ Push: web-push para subscription do device (com dedup por device+dia+regra)
    ↓
[Grava log em ClimateNotificationLog]
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 22 LTS
- npm 10+
- Docker + Docker Compose
- (Opcional) Conta no EmailJS para testar emails
- (Opcional) Par de chaves VAPID para testar push (gerável via `npx web-push generate-vapid-keys`)

### 1. Clone e instale

```bash
git clone https://github.com/joao-vitorb/alerta-dengue-udi.git
cd alerta-dengue-udi
npm install
```

### 2. Suba o banco

```bash
docker compose up -d
```

Isso sobe um PostgreSQL na porta 5432 com banco `alerta_dengue_udi`.

### 3. Configure as variáveis de ambiente

**Backend** — copie `backend/.env.example` para `backend/.env` e preencha:

```env
PORT=3333
NODE_ENV=development
LOG_LEVEL=info

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alerta_dengue_udi?schema=public

FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
WEATHER_TIMEZONE=America/Sao_Paulo

# EmailJS (opcional — emails ficam em modo simulado se vazio)
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_TEMPLATE_ID_CLIMATE_ALERT=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=

# VAPID (opcional — push fica em modo simulado se vazio)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:seuemail@exemplo.com

# Automação climática
CLIMATE_NOTIFICATION_AUTOMATION_ENABLED=true
CLIMATE_NOTIFICATION_CHECK_INTERVAL_MINUTES=30
CLIMATE_NOTIFICATION_STARTUP_DELAY_MS=10000
AUTOMATION_TRIGGER_SECRET=qualquer-string-aleatoria-longa
```

**Frontend** — copie `frontend/.env.example` para `frontend/.env`:

```env
VITE_API_URL=http://localhost:3333
VITE_VAPID_PUBLIC_KEY=  # mesma chave pública do backend
```

### 4. Aplique as migrations e gere o cliente Prisma

```bash
npx prisma migrate dev -w backend
```

### 5. Popule o banco com as unidades de saúde

```bash
npm run prisma:seed -w backend
```

Sem esse passo, o mapa e o modal "Postos de Saúde Próximos" ficam vazios (a tabela `HealthUnit` é populada via seed, não por migration).

### 6. Rode o backend e o frontend

Em terminais separados:

```bash
npm run dev -w backend     # porta 3333
npm run dev -w frontend    # porta 5173
```

Acesse <http://localhost:5173>.

### 7. (Opcional) Sincronize dados derivados do GeoJSON

Se modificar o GeoJSON dos bairros:

```bash
node scripts/syncNeighborhoodClimate.mjs
node scripts/syncNeighborhoodWeatherCoordinates.mjs
```

---

## Como testar as features

### 1. Fluxo básico

1. Abra <http://localhost:5173>.
2. Complete o onboarding escolhendo um bairro de Uberlândia (ex: Centro, Tibery, Santa Mônica). No mobile, você pode ativar a geolocalização e o bairro é detectado automaticamente.
3. Na etapa de notificações, ative push (mobile) e/ou email — os dois toggles são independentes. Se ativar email, informe um endereço.
4. Confirme — você cai na dashboard com mapa, clima e recomendações preventivas.

### 2. Testando notificações (rápido)

Na dashboard, abra **Preferências → Testar notificações**:

- **"Enviar email de teste"** — chega imediatamente na sua caixa.
- **"Enviar push de teste (15s)"** — chega 15 segundos depois (feche o app ou bloqueie a tela para ver na lock screen).

### 3. Testando a detecção automática de bairro (mobile)

1. Abra o app no celular ou no Chrome desktop em modo mobile (DevTools → Toggle Device Toolbar).
2. No onboarding, ative o toggle "Permitir geolocalização".
3. Aceite a permissão do navegador.
4. O select de bairro será bloqueado e o bairro detectado aparecerá automaticamente abaixo.

### 4. Testando push em iOS

iOS exige PWA instalado para receber push:

1. Abra a URL **no Safari** (não Chrome).
2. Compartilhar → Adicionar à Tela de Início.
3. Abra pelo ícone da tela inicial (vai abrir em modo standalone).
4. Refaça onboarding ativando push, aceite a permissão iOS.
5. Use o botão "Enviar push de teste" — feche o PWA (swipe up) e espere 15 segundos.

### 5. Disparando o ciclo de alertas climáticos manualmente

```bash
curl -X POST "http://localhost:3333/api/automation/climate-notifications/run?dryRun=true" \
  -H "x-automation-secret: SEU_SECRET_DO_ENV"
```

Resposta mostra quantos bairros e usuários foram avaliados, e quantos disparariam alerta.

Sem `?dryRun=true`, o envio acontece de verdade.

### 6. Rodando os testes

```bash
npm test -w backend
```

19 testes cobrem as regras climáticas e a derivação de sinais (probabilidade, acúmulo recente, calor + umidade, hierarquia de regras).

---

## Estrutura do projeto

```
alerta-dengue-udi/
├── backend/
│   ├── prisma/
│   │   ├── migrations/         # Migrations versionadas
│   │   └── schema.prisma       # Modelos: UserPreference, PushSubscription,
│   │                           # WeatherSnapshot, HealthUnit, ClimateNotificationLog
│   └── src/
│       ├── config/             # env tipada, CORS, prisma config
│       ├── controllers/        # Handlers HTTP finos
│       ├── infra/              # Clients externos (EmailJS, web-push)
│       ├── lib/                # Logger e instância do Prisma
│       ├── middlewares/        # errorHandler, validateRequest, rateLimiters,
│       │                       # requireAutomationSecret
│       ├── routes/             # Definição de rotas REST
│       ├── schemas/            # Schemas Zod de validação
│       ├── services/           # Regras de negócio (clima, notificação, etc)
│       ├── utils/              # Helpers puros (asyncHandler, etc)
│       └── server.ts
│
├── frontend/
│   ├── public/
│   │   ├── data/               # GeoJSON dos bairros
│   │   ├── manifest.webmanifest
│   │   └── push-sw.js          # Service worker do push
│   └── src/
│       ├── components/         # UI (dashboard, map, onboarding)
│       ├── config/             # env do Vite
│       ├── data/               # Coordenadas e nomes de bairros
│       ├── errors/             # ApiError customizado
│       ├── hooks/              # useUserPreference, useBrowserLocation, etc
│       ├── lib/                # apiClient tipado, ícones
│       ├── pages/              # MapPage, NotFoundPage
│       ├── services/           # HTTP clients para cada recurso
│       ├── styles/             # global.css com design tokens
│       ├── types/              # Tipos compartilhados
│       └── utils/              # Helpers puros
│
├── scripts/                    # Scripts de geração de dados
├── .github/workflows/          # CI (typecheck, test, lint, build)
└── docker-compose.yml          # PostgreSQL local
```

---

## Variáveis de ambiente — referência completa

### Backend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string do PostgreSQL |
| `PORT` | | Porta do servidor (default 3333) |
| `NODE_ENV` | | `development` ou `production` |
| `LOG_LEVEL` | | `debug` / `info` / `warn` / `error` (default `info`) |
| `FRONTEND_URL` | | URL do frontend para CORS fallback |
| `ALLOWED_ORIGINS` | | Lista de origens permitidas (separada por vírgula) |
| `WEATHER_API_BASE_URL` | | Base URL do Open-Meteo |
| `WEATHER_TIMEZONE` | | Fuso horário usado (default `America/Sao_Paulo`) |
| `EMAILJS_SERVICE_ID` | | ID do serviço EmailJS |
| `EMAILJS_TEMPLATE_ID` | | Template usado no endpoint de teste |
| `EMAILJS_TEMPLATE_ID_CLIMATE_ALERT` | | Template usado nos alertas climáticos |
| `EMAILJS_PUBLIC_KEY` | | Chave pública EmailJS |
| `EMAILJS_PRIVATE_KEY` | | Chave privada EmailJS |
| `VAPID_PUBLIC_KEY` | | Chave pública VAPID (igual à do frontend) |
| `VAPID_PRIVATE_KEY` | | Chave privada VAPID |
| `VAPID_SUBJECT` | | `mailto:...` ou URL `https://...` |
| `CLIMATE_NOTIFICATION_AUTOMATION_ENABLED` | | `true` para ligar o scheduler automático |
| `CLIMATE_NOTIFICATION_CHECK_INTERVAL_MINUTES` | | Intervalo entre execuções (default 30) |
| `CLIMATE_NOTIFICATION_STARTUP_DELAY_MS` | | Atraso até a primeira execução (default 10000) |
| `AUTOMATION_TRIGGER_SECRET` | ✅ (em prod) | Secret do header `x-automation-secret` para disparo manual |

### Frontend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | ✅ | URL base do backend |
| `VITE_VAPID_PUBLIC_KEY` | | Chave pública VAPID (mesma do backend) |

---

## Limitações conhecidas

- **Cold start do backend** em produção: free tier do Render dorme após 15 min de inatividade. A primeira requisição depois disso pode demorar até 30s.
- **Banco free expira em 90 dias** no Render — para uso contínuo precisa migrar para tier pago ou recriar.
- **Push em iOS** só funciona via PWA instalado (limitação da Apple, não do projeto).
- **Geolocalização em desktop** é desabilitada porque a posição vem de IP/Wi-Fi (impreciso). Em mobile usa GPS.
- **Limite de 200 emails/mês** no plano free do EmailJS.
- **Banco fresh sem seed** apresenta o mapa e o modal de unidades vazios. Rode `npm run prisma:seed -w backend` uma vez após criar o banco para popular as unidades de saúde oficiais.

---

## Decisões de produto explicadas

- **Por que sem cadastro?** Reduz fricção. O caso de uso (lembrete preventivo) não exige identidade real. O `anonymousId` no localStorage é suficiente para personalizar bairro e canal de notificação.
- **Por que dedup por destinatário e não por device?** Em testes, descobrimos que múltiplos cadastros com mesmo email (vários devices da mesma pessoa) geravam emails duplicados. A dedup atual (`email + ruleKey + dia` para email; `device + ruleKey + dia` para push) resolve isso preservando push localizado por device.
- **Por que template climático no email de teste?** Para o usuário (e o recrutador) ver exatamente como será o alerta real, sem necessidade de esperar uma chuva.
- **Por que rate limit em endpoint de teste?** Evita que o link da app sirva como vetor para spammar EmailJS.

---

## Licença

Projeto pessoal de portfólio, sem licença pública de distribuição definida. Sinta-se à vontade para clonar, ler o código e usar como referência para projetos próprios.

---

## Contato

João Vitor Borges — [LinkedIn](https://www.linkedin.com/in/joao-vitorb) · joaovborges2005@hotmail.com
