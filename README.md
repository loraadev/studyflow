# StudyFlow 📚

Sistema web de organização de estudos e acompanhamento de produtividade. Esse projeto foi desenvolvido para fins universitários. 

🔗 **Demo ao vivo:** https://studyflow-sand.vercel.app

---

## Funcionalidades

- **Dashboard** — visão geral com métricas do dia, semana e sequência
- **Planejamento** — criação e gerenciamento de tarefas por prioridade
- **Timer** — cronômetro com modo Pomodoro e registro automático
- **Relatórios** — gráficos de evolução por dia e por disciplina

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite |
| Estilização | Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL) |
| Hospedagem | Vercel |
| Testes | Vitest + Testing Library |
| CI/CD | GitHub Actions |

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SeuUsuario/studyflow.git
cd studyflow

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves do Supabase

# 4. Rode o projeto
npm run dev
```

## Variáveis de ambiente

Configure as variáveis de ambiente.

`VITE_SUPABASE_URL=sua_url_do_supabase`  
`VITE_SUPABASE_ANON_KEY=sua_chave_anon`

## Testes

```bash
npx vitest run
```

## Estrutura do projeto

````
src/
├── api/          # Camada de acesso ao Supabase
├── components/   # Componentes React reutilizáveis
│   └── ui/       # Componentes base (Button, Card, Badge...)
├── context/      # Estado global com Context API
├── hooks/        # Hooks customizados (useTimer...)
├── utils/        # Funções utilitárias puras
└── tests/        # Testes automatizados
````

## CI/CD

A cada push na branch `main` o GitHub Actions executa automaticamente:
1. Instalação das dependências
2. Testes automatizados
3. Build de produção

Se tudo passar, a Vercel faz o deploy automaticamente.