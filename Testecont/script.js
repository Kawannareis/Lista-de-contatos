document.addEventListener("DOMContentLoaded", () => {
  const listaContatos = document.getElementById("listaContatos");
  const btnCriarContato = document.getElementById("criarContato");
  const formContato = document.getElementById("formContato");
  const btnFecharFormulario = document.getElementById("fecharFormulario");
  const btnSalvarContato = document.getElementById("salvarContato");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const inputPesquisa = document.getElementById("pesquisarContato");

  let indiceEditando = null; // variável global para controle da edição

  function carregarContatos() {
    listaContatos.innerHTML = "";
    const contatos = JSON.parse(localStorage.getItem("contatos")) || [];

    contatos.forEach((contato, index) => {
      const div = document.createElement("div");
      div.classList.add("contato");

      div.innerHTML = `
        <h1>Nome: ${contato.nome}</h1>
        <h2>Telefone: ${contato.telefone}</h2>
        <h3>Email: ${contato.email}</h3>
        <button class="excluirContato" data-index="${index}">X</button>
        <button class="editarContato" data-index="${index}">Editar</button>
      `;

      listaContatos.appendChild(div);
    });
  }

  function mostrarMensagem() {
    mensagemSucesso.style.display = "block";
    setTimeout(() => {
      mensagemSucesso.style.display = "none";
    }, 3000);
  }

  btnCriarContato.addEventListener("click", () => {
    formContato.style.display = "block";
    indiceEditando = null; // Reseta o índice ao criar novo
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
  });

  btnFecharFormulario.addEventListener("click", () => {
    formContato.style.display = "none";
  });

  btnSalvarContato.addEventListener("click", () => {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (nome && telefone && email) {
      const contatos = JSON.parse(localStorage.getItem("contatos")) || [];

      if (indiceEditando !== null) {
        // Atualizando contato existente
        contatos[indiceEditando] = { nome, telefone, email };
      } else {
        // Criando novo contato
        contatos.push({ nome, telefone, email });
      }

      localStorage.setItem("contatos", JSON.stringify(contatos));

      formContato.style.display = "none";
      indiceEditando = null;
      carregarContatos();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("excluirContato")) {
      const index = e.target.getAttribute("data-index");
      const contatos = JSON.parse(localStorage.getItem("contatos")) || [];
      const contatoExcluido = contatos.splice(index, 1)[0];
    
      const lixeira = JSON.parse(localStorage.getItem("lixeira")) || [];
      lixeira.push(contatoExcluido);
    
      localStorage.setItem("contatos", JSON.stringify(contatos));
      localStorage.setItem("lixeira", JSON.stringify(lixeira));
    
      carregarContatos(); // Atualiza a lista após exclusão
      mostrarMensagem();  // Mensagem de sucesso
    }
    
      

    if (e.target.classList.contains("editarContato")) {
      indiceEditando = e.target.getAttribute("data-index");
      const contatos = JSON.parse(localStorage.getItem("contatos")) || [];
      const contato = contatos[indiceEditando];

      document.getElementById("nome").value = contato.nome;
      document.getElementById("telefone").value = contato.telefone;
      document.getElementById("email").value = contato.email;

      formContato.style.display = "block";
    }
  });

  inputPesquisa.addEventListener("input", () => {
    const termo = inputPesquisa.value.toLowerCase();
    const contatos = document.querySelectorAll(".contato");

    contatos.forEach((contato) => {
      const nome = contato.querySelector("h1").textContent.toLowerCase();
      const telefone = contato.querySelector("h2").textContent.toLowerCase();
      const email = contato.querySelector("h3").textContent.toLowerCase();

      if (nome.includes(termo) || telefone.includes(termo) || email.includes(termo)) {
        contato.style.display = "block";
      } else {
        contato.style.display = "none";
      }
    });
  });

  carregarContatos();
});

const btnVerLixeira = document.getElementById("btnVerLixeira");
const lixeiraContatos = document.getElementById("lixeiraContatos");

btnVerLixeira.addEventListener("click", () => {
  const lixeira = JSON.parse(localStorage.getItem("lixeira")) || [];
  lixeiraContatos.innerHTML = ""; // Limpa o conteúdo

  if (lixeira.length === 0) {
    lixeiraContatos.innerHTML = "<p>Nenhum contato na lixeira.</p>";
  } else {
    lixeira.forEach((contato, index) => {
      const div = document.createElement("div");
      div.classList.add("contato");

      div.innerHTML = `
        <h1>Nome: ${contato.nome}</h1>
        <h2>Telefone: ${contato.telefone}</h2>
        <h3>Email: ${contato.email}</h3>
        <button class="restaurarContato" data-index="${index}">Restaurar</button>
      `;

      lixeiraContatos.appendChild(div);
    });
  }

  lixeiraContatos.style.display = "block"; // mostra a lixeira
});

// Restaurar contato da lixeira
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("restaurarContato")) {
    const index = e.target.getAttribute("data-index");
    const lixeira = JSON.parse(localStorage.getItem("lixeira")) || [];
    const contatoRestaurado = lixeira.splice(index, 1)[0];

    const contatos = JSON.parse(localStorage.getItem("contatos")) || [];
    contatos.push(contatoRestaurado);

    localStorage.setItem("contatos", JSON.stringify(contatos));
    localStorage.setItem("lixeira", JSON.stringify(lixeira));

    carregarContatos();

    // Atualiza visual da lixeira
    btnVerLixeira.click();
  }
});
