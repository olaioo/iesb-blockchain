
window.addEventListener('load', () => {
    console.log("*** editing information page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);

    // restaga formulário de informações
    let form = document.getElementById("editInfo");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', updateInformation);

    getInformation();
});

function getInformation() {
    console.log("*** Getting Information ***");

    $.get("/getInformation", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> getInformation: ***", res.msg);

            if (res.msg === "no information yet") {
                return;
            }

            let information = JSON.parse(res.privateData);
            console.log(information.email);

            $('#email').val(information.email);
            $('#contactNumber').val(information.contactNumber);
            
        } else {
            alert("Erro ao resgatar produtos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function updateInformation(event) {
    event.preventDefault();
    console.log("*** Editing information ***");

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let email = $("#email").val();
    let contactNumber = $("#contactNumber").val();

    const newPrivateData = {email, contactNumber};
    // envia a requisição para o servidor
    $.post("/updateInformation", {newPrivateData}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> updateInformation: ***", res.msg);            
            // limpa dados do formulário
            $("#email").val("");
            $("#contactNumber").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Seus dados foram atualizados com sucesso");
            window.location.href = "/editInfo";
        } else {
            alert("Erro ao atualizar informações. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}