
window.addEventListener("load", function() {

    
    // restaga formulário de produtos
    let form = document.getElementById("addAppInfo");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', addAppInfo);
})

function addAppInfo() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let pk = $("#pk").val();
    let name = $("#name").val();

    // pega o valor dos checkboxes selecionados
    // e adiciona no array productsIds
    let requiredData = [];
    $.each($("input[name='requiredData']:checked"), function() {
        requiredData.push($(this).val());
    });

    // envia a requisição para o servidor
    $.post("/addNewAppInfo", {pk, name, requiredData}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> addAppIndo: ***", res.msg);            
            // limpa dados do formulário
            $("#pk").val("");
            $("#name").val("");
            $('input[type=checkbox]').prop('checked', false);
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Seu APP foi cadastrado com sucesso");
        } else {
            alert("Erro ao cadastrar APP. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    
}