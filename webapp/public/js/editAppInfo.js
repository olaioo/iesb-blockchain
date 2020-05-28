let appPk;

window.addEventListener('load', () => {
    console.log("*** editing product page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    appPk = url.searchParams.get("pk");
    console.log("App Public key: ", appPk);

    // restaga formulário de produtos
    let form = document.getElementById("editAppInfo");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', updateAppInfo);

    getEditAppInfo(appPk);
});

function getEditAppInfo(id) {
    console.log("*** Getting APP info1 ***");

    console.log(id);
    $.post("/AppInfo", {id}, function(res) {
        
        console.log(res);
        if (!res.error) {
            console.log("*** Views -> js -> produtos.js -> getProduct: ***", res.msg);

            if (res.msg === "no APP info yet") {
                return;
            }

            let appInfo = res.app;

            $('#pk').val(appInfo.pk);
            $('#name').val(appInfo.name);

            for(let i = 0; i < appInfo.requiredData.length; i++){
                $('#'+appInfo.requiredData[i]+'Check').prop('checked', true);
            }
            
        } else {
            alert("Erro ao resgatar produtos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function updateAppInfo(event) {
    event.preventDefault();
    console.log("*** Editing product: ", appPk);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let name = $("#name").val();
    let requiredData = [];
    $.each($("input[name='requiredData']:checked"), function() {
        requiredData.push($(this).val());
    });

    // envia a requisição para o servidor
    $.post("/addNewAppInfo", {pk: appPk, name, requiredData}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> updateAppInfo: ***", res.msg);            
            // limpa dados do formulário
            $("#pk").val("");
            $("#name").val("");
            $('input[type=checkbox]').prop('checked', false);
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Seu APP foi alterado com sucesso");
            window.location.href = "/api/auth/dashboard";
        } else {
            alert("Erro ao alterar APP. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}