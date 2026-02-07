# Lista de Tarefas

Este é um aplicativo de gerenciamento de tarefas feito como parte do teste técnico da Fatto. A aplicação permite adicionar, editar excluir e reordenar as tarefas listadas. A reordenação pode ser feita **arrastando e soltando** as tarefas ou pelos **botões de mover para cima/baixo**.

O respositório contem o backend e o frontend

---

## Tecnologias Utilizadas

**Backend:**
- [Express.js](https://expressjs.com/pt-br/) - Servidor REST API
- [Prisma](https://www.prisma.io/typescript) - ORM para manipulação do banco de dados

**Frontend:**
- [Tailwind CSS](https://tailwindcss.com/) - Estilização e responsividade
- [Sortable](https://sortablejs.github.io/Sortable/) - Funcionalidade de drag-n-drop

## Como Executar

### 1. Backend

1. Instale as dependências:
```bash
cd backend
npm install
```

2. Configure o banco de dados no arquivo .env:
```bash
DATABSE_URL="url_do_banco"
```

3. Rode as migrations do Prisma:
```bash
npx prisma migrate dev
```

4. Inicie o servidor:
```bash
npm run dev
```
O backend estará rodando em http://localhost:3000

### 2. Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Compile o Tailwind CSS:
```bash
npm run build:css
```

3. Abra o index.html no navegador ou rode um servidor local
