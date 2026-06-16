# Complementa+ (Mobile - Senac)

## Sobre o projeto

O Complementa+ Mobile é o aplicativo oficial do projeto desenvolvido especificamente para os **Alunos** da rede Senac. Com foco total na praticidade e autonomia do estudante, o app permite que os alunos acompanhem seu progresso de horas complementares e enviem certificados (comprovantes) de forma rápida e intuitiva diretamente pelo celular. *(Nota: As funções de Coordenador e Administrador são exclusivas da plataforma Web).*

---

## Tecnologias

**Stack Principal:**

* **Mobile (Frontend):** React Native (Expo v54) + TypeScript
* **Backend (API Compartilhada):** Node.js (Express)
* **Autenticação:** Firebase Auth
* **Banco de Dados:** Cloud Firestore
* **Armazenamento de Arquivos:** Firebase Storage

**Requisitos para rodar:**

* Node.js 18+ (LTS recomendado).
* Aplicativo **Expo Go** instalado no celular (disponível para iOS e Android).
* Conta Firebase com Auth, Firestore e Storage habilitados.

---

## Funcionalidades Exclusivas (Perfil Aluno)

O aplicativo móvel foi projetado para simplificar a jornada do estudante, oferecendo:

* **📊 Dashboard de Progresso:** Acompanhamento visual da barra de progresso individual. O aluno vê rapidamente quantas horas já foram aprovadas, quantas estão em análise e quantas faltam para atingir a meta, separadas por categorias (Ensino, Pesquisa e Extensão).
* **📤 Submissão Simplificada:** Envio de atividades preenchendo apenas os dados essenciais (Nome do Evento, Carga Horária, Categoria).
* **📸 Upload Direto:** Facilidade de anexar comprovantes (certificados) navegando diretamente pelos arquivos do celular (PDF ou imagens).
* **🕒 Histórico de Solicitações:** Tela dedicada para o aluno visualizar o status de todos os certificados já enviados (Aprovado, Pendente ou Reprovado) e ler as justificativas deixadas pelos coordenadores.

---

## Como rodar localmente

Como o App depende da API para funcionar, você precisa rodar o backend localmente ou apontar para a API em produção. O ambiente Mobile exige atenção à conexão de rede, pois o seu celular precisa encontrar a API.

### App Mobile (Expo)

No Expo, as variáveis públicas devem começar obrigatoriamente com `EXPO_PUBLIC_`.

1. Acesse a pasta do mobile:
```bash
cd mobile
npm install

```


2. Copie `mobile/.env.example` para `mobile/.env` e preencha com suas chaves do Firebase Web SDK.
3. **ATENÇÃO À API BASE:** * Se a API estiver rodando na sua máquina (Local): A variável `EXPO_PUBLIC_API_BASE` **não pode ser `localhost**`. Ela deve ser o **endereço IPv4** do seu computador na rede Wi-Fi (ex: `http://192.168.0.x:8080`).
* Se for usar a API de produção: Coloque a URL oficial do Render.


4. Inicie o Expo:
```bash
npx expo start

```


5. Abra o aplicativo **Expo Go** no seu celular e escaneie o QR Code que aparecer no terminal.

---

## Estrutura de pastas

| Diretório | Descrição |
| --- | --- |
| `src/` | Diretório raiz do código fonte da aplicação Mobile. |
| `src/screens/` | Contém as telas exclusivas do fluxo do aluno (Login, Dashboard, Submissão, Histórico). |
| `src/components/` | Componentes visuais reutilizáveis (Botões, Inputs, Cards de Atividade). |
| `src/services/` | Lógica de comunicação com a API e o Firebase. |

---

## Rotas e Comunicação (API)

O aplicativo mobile consome apenas as rotas destinadas ao aluno da API central, enviando o token JWT no cabeçalho das requisições para garantir a segurança.

| Método | Rota | Descrição no Mobile |
| --- | --- | --- |
| GET | `/api/auth/me` | Valida o login e garante que apenas usuários com role `ALUNO` acessem o app. |
| POST | `/api/aluno/submissao` | Envia os dados e o arquivo Base64 do certificado para validação. |
| GET | `/api/aluno/historico` | Busca a lista de atividades enviadas por aquele aluno específico. |

*Nota: Todas as requisições exigem o cabeçalho `Authorization: Bearer <idToken>`.*

---

## Credenciais de teste

Para testar o aplicativo pelo Expo Go, utilize as credenciais de um aluno previamente cadastrado pelo Administrador no sistema Web.

* **Padrão de Senha Aluno:** Matrícula do aluno gerada no cadastro inicial. (Exemplo: se o email for `aluno@senac.br` e a matrícula `123456`, a senha será `123456`).

---

## Deploy / Build (Produção)

O ecossistema mobile funciona de forma independente do Web para o usuário final:

* **Mobile (Aplicativo):** Para gerar o pacote final de instalação do app (APK/AAB para Android ou IPA para iOS) utiliza-se o EAS (Expo Application Services).
* Comando básico de build na nuvem: `eas build --platform android` ou `eas build --platform ios`.


* **Backend:** A variável `EXPO_PUBLIC_API_BASE` no `.env` do Expo deve apontar para a URL oficial da API no Render antes de gerar o build.

---

## Dicas para a equipe

* **Problemas de Conexão no Expo Go:** Se o app carregar no celular, mas o login não funcionar, 99% das vezes é porque o celular e o computador não estão na mesma rede Wi-Fi, ou o seu IPv4 mudou. Verifique o seu IP e atualize o `.env` do mobile.
* **Segurança:** Nunca façam commit de arquivos `.env` contendo as chaves do Firebase.
* **Experiência do Usuário (UX):** Lembrem-se que o aluno usará o app para anexar arquivos. Testem se a seleção de arquivos (PDFs e Imagens) do celular está funcionando corretamente e se as permissões de acesso aos arquivos locais foram concedidas.

---

## Equipe

Projeto Integrador (PI) do 3º módulo desenvolvido com dedicação pelo squad:

* Abraão Melo
* Fabio Faustino
* Júlio César
* Kauã
* Gabriel Feliciano
* Angelo Mascarenhas
* Rhuan Pietro