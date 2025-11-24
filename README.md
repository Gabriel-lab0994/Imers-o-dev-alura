O **ProcurarClínica** é um site em desenvolvimento cujo objetivo é permitir que usuários encontrem **clínicas, médicos e serviços de saúde** filtrando pela cidade dele aqui do Rio de Janeiro.

O projeto foi desenvolvido em **HTML, CSS e JavaScript puro**, utilizando dois arquivos JSON para carregar dinamicamente:

- **filtros.json** – Tipos de especialidades (pediatra, dermatologista, cardiologista etc.)
- **data.json** – Informações das clínicas, incluindo imagem, endereço, telefone, horário e especialidades.

---

## ✨ Funcionalidades

### ✔️ **1. Barra de busca (header)**
O usuário pode digitar um nome de clínica, bairro, cidade ou especialidade.  
A busca filtra automaticamente todas as clínicas exibidas.

### ✔️ **2. Filtros deslizantes**
A página exibe uma barra horizontal de filtros gerada a partir do `filtros.json`.

- Rola para os lados com **setas de navegação** (carrossel horizontal).
- Cada item representa uma especialidade médica.
- Ao clicar em um filtro, somente as clínicas com aquela especialidade são exibidas.

### ✔️ **3. Cards gerados dinamicamente**
Cada card é criado via JavaScript usando os dados de `data.json`.

Cada card contém:
- Foto da clínica (não consegui colocar a API, buscar as fotos das clinicas tentei de tudo) 
- Nome  
- Bairro e endereço  
- Horário de funcionamento  
- Telefone  
- Especialidades  
- Botão “Acesse no mapa” com o link direto para o Google Maps

## 🧠 Como funciona o sistema

### **Carregamento dos filtros**
O script lê o `filtros.json` e cria `<li>` automaticamente dentro da `<nav>`.  
Cada `<li>` recebe um evento para filtrar as clínicas por especialidade.

### **Carregamento dos cards**
O `data.json` é carregado e cada clínica é convertida em um `<article class="card">`.

### **Busca**
A função de busca:
- Lê o texto do input
- Converte para minúsculas
- Procura nos campos: nome, bairro, endereço e especialidades

### **Navegação por setas (slider)**
As setas alteram o `scrollLeft` da `<ul>` para mover a barra de filtros lateralmente.

---

## 🚀 Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript Vanilla**
- **JSON (para dados dinâmicos)**
- **Google Fonts – Inter**
- **Google Maps (via URL)**

