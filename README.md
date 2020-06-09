### Dependências necessárias

Os softwares necessários para rodar o app são:

<ol>
    <li> Nodejs/npm: https://nodejs.org/en/</li>
    <li> Truffle Framework (Para fazer deploy e testes do smart contract)</li>
    <li> Curl https://curl.haxx.se/ (Para enviar requisições ao parity pelo terminal) </li>
     <li> Parity https://wiki.parity.io/Setup (Linux / Mac) </li>
    <li> Parity https://github.com/paritytech/parity-ethereum/releases (Windows) </li>
</ol>

Após instalar o Nodejs: <br>

    -> npm install -g truffle

Para usuários Windows, execute o shell como administrador <br>
    
    npm install --global windows-build-tools --unsafe

### Instruções

#### Para rodar a blockchain

dentro da pasta blockchain <br>

Execute o seguinte comando: <br>

    parity --config nodes/node00/node.toml 

Em um outro terminal, execute os seguintes comandos: <br>

    curl --data '{"method":"parity_newAccountFromPhrase","params":["node00","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

O comando acima retornará um endereço da conta criada, copie este endereço pois o usaremos nos próximos passos. <br>
Para que o parity reconheça a conta pelo seu nome, use o comando abaixo: <br>

    curl --data '{"method":"parity_setAccountName","params":["0x00a1103c941fc2e1ef8177e6d9cc4657643f274b","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

Crie uma conta de usuário (não validador):

    curl --data '{"method":"parity_newAccountFromPhrase","params":["user","user"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540
    curl --data '{"method":"parity_setAccountName","params":["0x004ec07d2329997267ec62b4166639513386f32e","user"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

Pare a execução do nó. Descomente o código no arquivo /nodes/node00/node.toml <br>

Execute o nó com o comando: <br>

    parity --config nodes/node00/node.toml

#### Para fazer o deploy do contrato

Agora que a blockchain esta rodando, em um outro terminal, entre na pasta dapp. Para fazer o deploy do contrato basta executar: <br>

    truffle migrate --reset

Pare a execução do nó. Execute o nó com o comando: <br>

    parity --config nodes/node00/node.toml

#### Para executar o app

Dentro da pasta webapp <br>

    npm install
    npm start

Para fazer login: <br>
user: user <br>
senha: user<br>

### Guideline de funcionalidades 

Cadastro de informação privada

    Permite cadastrar informações privadas, nesse caso, apenas email e telefone de contato.
    
    Função do contrato: updatePrivateData(string memory newPrivateData)

Edição de informação privada

    Permite editar as informações privades inseridas pelo 'Cadastro de informação privada'.

    Função do contrato: updatePrivateData(string memory newPrivateData)

Adicionar APP
    
    Permite adicionar um aplicativo com chave publica (fornecida pelo app, com intuito de cifrar as informações disponíveis para ele), nome do app, e infomações requeridas pelo app.

    Funçao do contrato: setAppInfo(string memory appPublicKey, string memory name, string[] memory arrRequiredData)

Editar APP

    Permite editar as informações fornecidades pelo 'Adicionar APP', excluinda apenas a public key, essa não pode ser editada.

    Função do contrato: setAppInfo(string memory appPublicKey, string memory name, string[] memory arrRequiredData)

Disponibilizar informação privada (Individual)

    Permite disponibilizar todas as informações privadas cadastradas que o app está requerindo.

    Função do contrato: setAvailableDataTo(string memory appPublicKey, string memory encryptedData)

Disponibilizar informação privada (Global)

    De maneira semelhante a 'Disponibilizar informação privada', disponibiliza para todos os apps cadastrados as informações que cada um requisitou, com os dados de informação privada cadastrados.

    Função do contrato: setAvailableDateToAll(string[] memory _appPublicKeys, string[] memory encryptedDatas)

Remover APP

    Permite excluir completamente os dados de cadastro e dados fornecidados para um determinado app.

    Função do contrato: eraseDataTo(string memory appPublicKey)

Remover Todos APPs

    De maneira semelhanta a 'Remover APP', permite excluir completamente os dados de cadastro e dados fornecidos para todos os apps cadastrados.

    Função do contrato: eraseDataToAll()

Visualizar informação disponibilizada

    Permite verificar a informação disponibilizada para cada app crifrada, como também permite decifrar a informação disponibilizada.