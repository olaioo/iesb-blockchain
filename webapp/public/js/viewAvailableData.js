let appPk;

window.addEventListener('load', () => {
    console.log("*** view available data page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    appPk = url.searchParams.get("pk");
    console.log("App Public key: ", appPk);

    // restaga formulário de produtos
    let form = document.getElementById("viewAvailableData");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', decodeData);

    getAvailableData(appPk);
});

function getAvailableData(id) {
    console.log("*** Getting APP available data ***");

    console.log(id);
    $.post("/AppInfo", {id: id}, function(res) {
        
        console.log(res);
        if (!res.error) {
            console.log("*** Views -> js -> produtos.js -> getAvailableData: ***", res.msg);

            if (res.msg === "no APP info yet") {
                return;
            }

            let appInfo = res.app;

            $('#encryptedData').val(appInfo.availableData);
            
        } else {
            alert("Erro ao resgatar produtos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function decodeData(event) {
    event.preventDefault();
    console.log("*** Decode available data for: ", appPk);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let encryptedData = $("#encryptedData").val();
    let privateKey = $("#privateKey").val();
    console.log('Encrypted data:', encryptedData, privateKey);

    // envia a requisição para o servidor
    $.post("/decodeData", {encryptedData, privateKey}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> decodeData: ***", res.msg);            
            // limpa dados do formulário
            $("#decodedData").val(res.privateData);

            alert("Dado decifrado com sucesso!");
        } else {
            alert("Erro ao alterar APP. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}