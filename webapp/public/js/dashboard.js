
window.addEventListener("load", function() {

    // restaga formulário de produtos
    let form = document.getElementById("updateInfoToAllApps");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', updateInfoToAllApps);

    // função para carregar plubic keys app
    getAppInfos();
})

function updateInfoToAllApps(event) {
    event.preventDefault();
    $.post("/setAvailableDataToAll", function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> setAvailableDataToAll: ***", res.msg);            
            alert("Os dados foram atualizados para todos os APPs.");
            window.location.href = "/api/auth/dashboard";
        } else {
            alert("Erro ao remover informações. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}

function setAvailableData(pk) {
    $.post("/setAvailableData", {pk}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> setAvailable: ***", res.msg);            
            alert("Os dados foram atualizados para o APP escolhido.");
            window.location.href = "/api/auth/dashboard";
        } else {
            alert("Erro ao remover informações. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}

function eraseDataTo(pk) {
    $.post("/eraseDataTo", {pk}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> information.js -> eraseDataTo: ***", res.msg);            
            alert("Todos os dados foram excluídos");
            window.location.href = "/api/auth/dashboard";
        } else {
            alert("Erro ao remover informações. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}

function getAppInfos() {
    console.log("*** Getting AppInfos ***");

    $.get("/AppInfos", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> dashboard.js -> getAppInfos: ***", res.msg);

            if (res.msg === "no APPs info yet") {
                return;
            }

            let appInfos = res.appInfoList;

            // adiciona appInfos na tabela
            for (let i = 0; i < appInfos.length; i++) {
                let newRow = $("<tr>");
                let cols = "";
                let pk = appInfos[i].pk;
                let name = appInfos[i].name;
                let requiredData = appInfos[i].requiredData;

                cols += `<td> ...${pk.substring(pk.length-20,pk.length)} </td>`;
                cols += `<td> ${name} </td>`;
                cols += `<td> ${requiredData} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href = "/viewAvailableData?pk=${encodeURIComponent(pk)}"><i class="fas fa-eye"></i></a> 
                    </span>
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editAppInfo?pk=${encodeURIComponent(pk)}"><i class="fas fa-edit"></i></a>
                    </span>
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href = "javascript:setAvailableData('${pk}')" onclick = "if (! confirm('Confirma a atualização?')) { return false; }"><i class="fas fa-link"></i></a> 
                    </span>
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href = "javascript:eraseDataTo('${pk}')" onclick = "if (! confirm('Confirma a exclusão?')) { return false; }"><i class="fas fa-trash"></i></a> 
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#apps-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar app infos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}
