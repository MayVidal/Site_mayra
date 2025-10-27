// ❗ SUBSTITUA ESTE URL PELO SEU GOOGLE APPS SCRIPT PUBLICADO (Web App URL)!
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwL7dDHYLLwA9NxWzq6PlXKHQXNEYjQrnAoID5LqO9qWRcKu_1usW6TS_A1gDRH3u6F/exec"; 
// ❗ Exemplo: const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx7A_j5D.../exec";


// Admin
let adminLogin = "admin";
let adminSenha = "admin";

let cursos = [
  {nome:"Inglês", periodo:"Manhã", tipo:"ingles", bandeira:"https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"},
  {nome:"Espanhol", periodo:"Tarde", tipo:"espanhol", bandeira:"https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"},
  {nome:"Informática", periodo:"Noite", tipo:"informatica", bandeira:"monitor"}
];

// Funções Página inicial
function gerarCursos() {
  const div = document.getElementById("listaCursos");
  div.innerHTML = '<h3><i data-lucide="book-open" class="icon-red"></i> Selecione o curso desejado</h3>';
  cursos.forEach((c,idx)=>{
    let btn = document.createElement("button");
    btn.className="course-btn";
    btn.style.gap="10px";
    btn.innerHTML= c.tipo=="informatica" ? '<i data-lucide="monitor" class="icon-blue"></i> '+c.nome : '<img src="'+c.bandeira+'" width="24"> '+c.nome;
    btn.onclick=()=>{ selecionarCurso(c); };
    div.appendChild(btn);
  });
  lucide.createIcons();
}

// Selecionar curso
function selecionarCurso(curso){
  document.getElementById("cursoSelecionado").innerHTML = 'Curso selecionado: '+(curso.tipo=="informatica"?'<i data-lucide="monitor" class="icon-blue"></i>':'<img src="'+curso.bandeira+'" width="24">')+' '+curso.nome+' ('+curso.periodo+')';
  document.getElementById("curso").value = curso.nome;
  document.getElementById("periodo").value = curso.periodo;
  mostrarPagina2();
  lucide.createIcons();
}

function mostrarPagina2(){
  document.getElementById("pagina1").classList.add("hidden");
  document.getElementById("pagina2").classList.remove("hidden");
}

// Formatar CPF
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", function() {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0,11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

// CEP
async function buscarCEP(){
  const cep = document.getElementById("cep").value.replace(/\D/g,"");
  if(cep.length===8){
    try{
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if(data.erro){ alert("CEP não encontrado!"); document.getElementById("endereco").value=""; return; }
      document.getElementById("endereco").value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
    }catch(e){ alert("Erro ao buscar CEP."); }
  }
}

// Formulário (Função de Submissão com Fetch)
document.getElementById("formMatricula").addEventListener("submit", async function(e){
  e.preventDefault();

  let campos = ["nome","cpf","nascimento","sexo","orientacao","email","telefone","cep","endereco","numero","curso","periodo","origem"];
  let valido=true;
  let dadosFormulario = {};

  // 1. Validação e coleta dos dados
  campos.forEach(campo => {
    let input = document.getElementById(campo);
    let error = document.getElementById(campo + "Error");
    
    // O campo 'periodo' é readonly e não precisa de validação de erro
    if (campo !== "periodo" && (!input || !input.value.trim())) { 
        if (error) error.classList.remove("hidden"); 
        valido = false; 
    } else if (error) { 
        error.classList.add("hidden"); 
    }
    
    // Coleta o valor para envio
    if(input) {
      dadosFormulario[campo] = input.value.trim();
    }
  });

  if(valido){
    try {
      // 2. Envio dos dados para o Google Apps Script
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors', // Necessário para Web Apps
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario)
      });

      const resultado = await response.json();

      // 3. Feedback ao usuário
      if (resultado.status === "sucesso") {
        alert("Obrigado por fazer sua matrícula! Em breve entraremos em contato. 🎉");
        document.getElementById("formMatricula").reset();
        document.getElementById("pagina2").classList.add("hidden");
        document.getElementById("pagina1").classList.remove("hidden");
        document.getElementById("cursoSelecionado").innerHTML='';
      } else {
        alert("Ops! Ocorreu um erro ao enviar sua matrícula: " + resultado.mensagem);
        console.error("Erro do Apps Script:", resultado.mensagem);
      }
    } catch (error) {
      alert("Houve uma falha na comunicação com o servidor. Tente novamente.");
      console.error("Erro de Rede/Fetch:", error);
    }
  }
});


// Funções de Administração
function abrirLoginAdmin(){
  let login = prompt("Login:");
  let senha = prompt("Senha:");
  if(login===adminLogin && senha===adminSenha){
    document.getElementById("adminModal").style.display="flex";
    atualizarListaCursosAdmin();
  } else alert("Login ou senha incorretos!");
}
function fecharAdmin(){ document.getElementById("adminModal").style.display="none"; }
function atualizarLoginSenha(){
  let l=document.getElementById("adminLoginInput").value.trim();
  let s=document.getElementById("adminSenhaInput").value.trim();
  if(l) adminLogin=l;
  if(s) adminSenha=s;
  document.getElementById("adminLoginDisplay").innerText=adminLogin;
  document.getElementById("adminSenhaDisplay").innerText=adminSenha;
  alert("Login e senha atualizados!");
  document.getElementById("adminLoginInput").value="";
  document.getElementById("adminSenhaInput").value="";
}
function atualizarListaCursosAdmin(){
  const ul=document.getElementById("listaCursosAdmin");
  ul.innerHTML="";
  cursos.forEach((c,idx)=>{
    const li=document.createElement("li");
    li.innerHTML=c.nome+" ("+c.periodo+") <button onclick='removerCurso("+idx+")'>X</button>";
    ul.appendChild(li);
  });
}
function adicionarCurso(){
  const nome=document.getElementById("novoCursoNome").value.trim();
  const periodo=document.getElementById("novoCursoPeriodo").value.trim();
  const tipo=document.getElementById("novoCursoTipo").value;
  if(nome && periodo){
    let bandeira="";
    if(tipo=="ingles") bandeira="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg";
    else if(tipo=="espanhol") bandeira="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg";
    else if(tipo=="informatica") bandeira="monitor";
    cursos.push({nome, periodo, tipo, bandeira});
    atualizarListaCursosAdmin();
    gerarCursos();
    document.getElementById("novoCursoNome").value="";
    document.getElementById("novoCursoPeriodo").value="";
  } else alert("Preencha todos os campos do curso!");
}
function removerCurso(idx){
  cursos.splice(idx,1);
  atualizarListaCursosAdmin();
  gerarCursos();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    gerarCursos();
    lucide.createIcons();
});
