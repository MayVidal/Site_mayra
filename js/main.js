(function($){
    "use strict";
    /**Inicia o contador  */
    $('.contar').counterUp({
        time:1000,
        delay:10
    });
    /**suaviza scroll menu */
    var $doc = $('html,body');
    $('.scroll-page').click(function(){
      $doc.animate({
        scrollTop: $($.attr(this,'href')).offset().top
      },500);
      return false;
    })
})(jQuery);


/*Script para abrir e fechar o formulário modal*
const modal = document.querySelector('#modal');
const modalBackground = document.createElement('div');
*/
/* Script para abrir e fechar o formulário modal */
// Seleciona o elemento HTML com o ID 'modal'
const modal = document.querySelector('#modal');

// Cria um novo elemento HTML 'div' para ser usado como fundo do modal
const modalBackground = document.createElement('div');
modalBackground.classList.add('modal-background');

// Define a função para exibir o modal
function showModal() {
  // Adiciona o fundo do modal ao corpo do documento
  document.body.appendChild(modalBackground);

  // Exibe o modal definido pelo elemento HTML com o ID 'modal'
  modal.style.display = 'block';
}

// Define a função para esconder o modal
function hideModal() {
  // Remove o fundo do modal do corpo do documento
  modalBackground.remove();

  // Esconde o modal definido pelo elemento HTML com o ID 'modal'
  modal.style.display = 'none';
}

// Adiciona um evento de clique ao botão com o ID 'btn-orcamento' para exibir o modal quando clicado
//document.querySelector('#btn-orcamento').addEventListener('click', showModal);
document.querySelector('#open-modal-btn').addEventListener('click', showModal);

// Adiciona um evento de clique ao elemento HTML com a classe 'close' para esconder o modal quando clicado
document.querySelector('.close').addEventListener('click', hideModal);
/*04/05/23 aDICIONADO POSIÇÃO DO BTN image.png*/


modalBackground.classList.add('modal-background');

function showModal() {
document.body.appendChild(modalBackground);
modal.style.display = 'block';
}

function hideModal() {
modalBackground.remove();
modal.style.display = 'none';
}

document.querySelector('#open-modal-btn').addEventListener('click', showModal);
document.querySelector('.close').addEventListener('click', hideModal);
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//---------- Faz a requisição para a API do IBGE e preenche os selects de cidade e estado
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
    .then((response) => response.json())
    .then((data) => {
      // Filtra apenas os nomes das cidades e estados
      const cities = data.map((city) => city.nome);
      const states = data.map((city) => city.microrregiao.mesorregiao.UF.sigla);

      // Preenche as opções do select de cidades
      const citySelect = document.getElementById("city");
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.text = city;
        citySelect.appendChild(option);
      });

      // Preenche as opções do select de estados
      const stateSelect = document.getElementById("state");
      states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.text = state;
        stateSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar cidades e estados:", error);
    });
/*};*/

closeModalBtn.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/*Função para integrar a API ao site*/

function loadCitiesAndStates() {
    // Faz a requisição para a API do IBGE
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then(response => response.json())
      .then(data => {
        // Filtra apenas os nomes das cidades e estados
        const cities = data.map(city => city.nome);
        const states = data.map(city => city.microrregiao.mesorregiao.UF.sigla);
  
        // Preenche as opções do select de cidades
        const citySelect = document.getElementById('city');
        cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.text = city;
          citySelect.appendChild(option);
        });
  
        // Preenche as opções do select de estados
        const stateSelect = document.getElementById('state');
        states.forEach(state => {
          const option = document.createElement('option');
          option.value = state;
          option.text = state;
          stateSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar cidades e estados:', error);
      });
  }

  /**rEGRA cpf OU CNPJ */
/**
  const cpfInput = document.getElementById('cpf');
const cnpjInput = document.getElementById('cnpj');

document.querySelectorAll('input[name="document-type"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'cpf') {
      cpfInput.required = true;
      cnpjInput.required = false;
      cnpjInput.value = '';
    } else if (radio.value === 'cnpj') {
      cnpjInput.required = true;
      cpfInput.required = false;
      cpfInput.value = '';
    }
  });
});
* */
  /**----------------------------------Captura dados Form para LEAD----------------------------------- */
  function enviarFormulario() {
    const url = 'https://energiza-dev-ed.my.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const cnpj = document.getElementById('cnpj').value;
    const cep = document.getElementById('zip').value;
    const energyType = document.querySelector('input[name="00N5w00000DC1j8"]:checked').value;
    
    const formData = {
      'first_name': firstName,
      'last_name': lastName,
      'company': company,
      'email': email,
      'cpf': cpf,
      'cnpj': cnpj,
      'zip': cep,
      '00N5w00000DC1j8': energyType
    };
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('Novo objeto Lead criado com sucesso!');
      } else {
        console.error('A solicitação não foi bem-sucedida.');
      }
    };
    const encodedFormData = Object.keys(formData).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])).join('&');
    xhr.send(encodedFormData);
  }
  
  const formulario = document.querySelector('form');
  formulario.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário
    enviarFormulario();
  });


  //Configuracao dos formularios  suporte

  //mostra a div suporte
  function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  //mostrar e ocultar form suporte

  
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

//----------para lidar com o envio do formulário e redirecionamento para a página de agradecimento

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita o envio do formulário por padrão
  // Envie os dados do formulário para o endereço de e-mail especificado
  this.submit();
  // Redirecione para a página de agradecimento
  window.location.href = "https://energiza.netlify.app/agradecimento.html";
});


