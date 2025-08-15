Aplicação SPS - React + Node.js

Este repositório contém uma aplicação web desenvolvida com React no front-end e Node.js no back-end. A aplicação tem como objetivo gerenciar usuários, disciplinas, tarefas e notas, integrando autenticação com JWT.

 Como Rodar a Aplicação

Siga os passos abaixo para configurar e executar a aplicação localmente.

1. Clone o Repositório
git clone https://github.com/nikolasaugusto/teste-sps.git
cd teste-sps

2. Instale as Dependências
Back-end (Node.js)
cd teste-sps\test-sps-server
npm install

Front-end (React)
cd teste-sps\test-sps-react
npm install

4. Execute as Aplicações
Back-end
cd teste-sps\test-sps-server
npm run dev

Front-end
cd teste-sps\test-sps-react
npm run dev


Acesse o front-end pelo navegador em:
http://localhost:3001

 Credenciais de Acesso

Para realizar o login como administrador, utilize as seguintes credenciais:

E-mail: admin@spsgroup.com.br

Senha: 1234

Estrutura do Projeto
/backend     # API Node.js (Express + JWT + db.json)
/frontend    # Aplicação React (Frontend)

