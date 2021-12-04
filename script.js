const elementos = {
  iconePesquisa: document.querySelector("#icone-pesquisa"),
  inputPesquisa: document.querySelector(".input-pesquisa"),
  imagemPerfil: document.querySelector(".imagem-perfil"),
  username: document.querySelector(".username"),
  bio: document.querySelector(".bio-perfil"),
  quantidadeRepositorios: document.querySelector(".quantidade-repos"),
};

elementos.iconePesquisa.addEventListener("click", preencherDadosGithub);

async function obterDadosPesquisa() {
  try {
    const elementoPesquisa = document.querySelector(".input-pesquisa");

    const linkPesquisa = "https://api.github.com/search/";
    const pesquisaInserida = elementoPesquisa.value;
    const res = await fetch(linkPesquisa + pesquisaInserida);
    const dados = await res.json();

    return dados;
  } catch (err) {
    alert(err);
  }
}

async function preencherNomesRepositorios() {
  try {
    const dadosRepositorios = await obterDadosRepositorios(elementos.inputPesquisa.value);
    const elementoRepositorios = document.querySelector(".links-repositorios");
    elementoRepositorios.innerHTML = "";
    const repositoriosExistentes = document.querySelector(".dados-links");

    if (repositoriosExistentes !== null) {
      repositoriosExistentes.innerHTML = "";
    }

    let dadosHtml = "";

    Object.entries(dadosRepositorios).forEach((chave) => {
      dadosHtml += `<a class="dados-links" href="${chave[1].url}">${chave[1].nome}</a><br />\n`;
    });

    const dadosGithub = document.createElement("div");

    dadosGithub.classList.add("dados-links");
    elementoRepositorios.appendChild(dadosGithub);
    dadosGithub.innerHTML = dadosHtml;
  } catch (err) {
    alert(err);
  }
}

function checarPesquisaUsuario(username) {
  const usuario = username === "" ? "reek" : username;
  return usuario;
}

async function preencherDadosGithub() {
  try {
    const dadosPerfil = await obterDadosGithub(elementos.inputPesquisa.value);
    if (dadosPerfil === null) return;

    elementos.imagemPerfil.src = dadosPerfil.avatar_url;
    elementos.username.innerHTML = `<strong>Usuario:</strong> ${dadosPerfil.login}`;

    if (dadosPerfil.bio === null) {
      elementos.bio.innerHTML = `<strong>Bio:</strong> N/A`;
    } else {
      elementos.bio.innerHTML = `<strong>Bio:</strong> ${dadosPerfil.bio}`;
    }
    if (dadosPerfil.public_repos === 0) {
      elementos.quantidadeRepositorios.innerHTML = `<strong>Quantidade repositorios</strong>: 0`;
    } else {
      elementos.quantidadeRepositorios.innerHTML = `<strong>Quantidade repositorios:</strong> ${dadosPerfil.public_repos}`;
    }

    preencherNomesRepositorios();
  } catch (err) {
    alert(err);
  }
}

async function obterDadosRepositorios(username) {
  try {
    const usuario = checarPesquisaUsuario(username);
    const dadosRepositorios = await obterTodosRepositorios(usuario);

    const dadosImportantesRepositorios = [];

    dadosRepositorios.forEach((repositorio) => {
      dadosImportantesRepositorios.push({
        nome: repositorio.name,
        url: repositorio.html_url,
      });
    });

    return dadosImportantesRepositorios;
  } catch (error) {
    alert(error);
  }
}

async function obterDadosGithub(username) {
  try {
    const usuario = checarPesquisaUsuario(username);

    const dadosUrl = `https://api.github.com/users/${usuario}`;
    const resposta = await fetch(dadosUrl);
    const dados = await resposta.json();

    return dados;
  } catch (error) {
    alert(error);
  }
}

async function obterTodosRepositorios(username) {
  try {
    const usuario = checarPesquisaUsuario(username);

    const dadosRepositorios = `https://api.github.com/users/${usuario}/repos`;
    const resposta = await fetch(dadosRepositorios);
    const dadosRepos = await resposta.json();

    return dadosRepos;
  } catch (error) {
    alert(error);
  }
}

preencherDadosGithub();
