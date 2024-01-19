/*                          Aula (376) Preparando Base 
                            Aula (377) Conexão com o Mongo 
                            Aula 379 Resolvendo teste de cadastro de usuário 
                            Aula 380 Teste de Validação 
                            Aula 382 Validação de Email 
                            Aula 383 Bcrypt 27/08/23 
                            Aula 385 Usuário Principal 
                            Aula 386 Teste de JWT 
                            Aula 387 Geração de Token *
                            Aula 389 Validação de JWT */ 


//(1-376) vou carregar o express
let express = require("express")
//(2-376) vou carregar a instância da minha aplicação
let app = express();
//(6-377) Conectando com o mongoose
let mongoose = require("mongoose");
/*(9-379) Importando arquivo model (User.js) */
let user = require("./models/user");
/*(14-383) Importando o bcrypt */
let bcrypt = require("bcrypt");
/*(17-386) Importar biblioteca jsonwebton (JWT) */
let jwt = require("jsonwebtoken");
/*(18-387) Antes de começar a gerar um token preciso ter um SECRET, como se fosse uma senha que só eu sei para validar os tokens */
let JWTSecret = "umpassodecadavez81484aa/a/q/e/4d44d4d4d4"; 



//                  [ CONECTANDO COM O MONGOOSE ]
//(7-377)
mongoose.connect("mongodb://127.0.0.1:27017/guiapics", {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() =>{
            //console.log("Conectado com o Banco");
        }).catch((err) =>{
            console.log(err);
        
        });

/*(10-379) Vou criar o model para carregar a variável user (9-379) estou passando como parâmetro o model User, e variável
user */
let User = mongoose.model("User", user);

//                 [ IMPORTAANDO O BODY-PARSER INTERNAMENTE]

//(3-376) Usando o [BODY-PARSER] interno do express
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//                 [ ROTA PRINCIPAL DA APLICAÇÃO -]

//(4-376)
app.get("/",(req, res) => {
    //res.json({});

});
//                  [ ROTA DO USUÁRIO ] OPERAÇÃO ASSÍNCRONA (async e await)

/*(8-379) O teste quer uma rota com a /user do tipo post (ARQ user.test.js - 4-378)*/
app.post("/user", async (req, res) => {

/*(12-380) Fazendo a validação para o teste (4-380 ARQ user.test.js) para impedir que usuários
envie dados vazios para essa rota */
// Se esse campos req.bod forem vazios
    if(req.body.name == "" || req.body.email == ""  || req.body.password == ""){
        // Vou dar um sendStatus (400) porque é isso que meu teste espera, uma falha
        res.sendStatus(400);
        // Vou dar um return para finzalizar a função 
        return;
    }

    try{
/*(13-382) Vou fazer uma validação para saber se existe mais um email no banco de dados */
// Vou receber um usuário que vou buscar no banco de dados através do modo (USER) com a função (FINDONE)
// Quero achar um usuário que tenha um email quando passar para mim via requisição
let user = await User.findOne({"email": req.body.email})
// Se o Usuário for diferente de undefined significa que existe um usuário com esse email
    if(user != undefined){
// O meu teste exige que eu retorne um código statusCode = 400;
        res.statusCode = 400;
// O meu teste exige que eu retorne um código de erro (5-381)
        res.json({error: "E-mail já cadastrado" })
// Para encerrar essa função
        return;
        
    }

/*(15-383) */
    let password = req.body.password;
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

/*(11-379) [CRIANDO UM USUÁRIO] com a var newUser e vou passar os dados dentro do objeto json que é referente
ao teste que pede esses dados (ARQ user.test.js 4-378) */
    let newUser = new User({name: req.body.name, email: req.body.email, password: hash})
    /*  [PEDIR PARA O USUÁRIO SER SALVO] */
    await newUser.save();
/* O meu teste tem um requisito que se o usuário for cadastro com sucesso eu tenho que retornar o email dele para o teste
expect(res.body.email).toEqual(email)(ARQ user.test.js - 4-378)  */
    res.json({email: req.body.email})
    }catch(err){
/* O erro 500 significa que houve um erro interno no banco de dados */
        res.sendStatus(200)    
    }
})

/*(16-385) Criando rota para deleção de email de usuário */
app.delete("/user/:email", async (req, res) => {
// Vou chamar meu model do mongoose (remove), vou remover um usuário que tenha um email igual ao email que eu receber
// pela url
    await User.deleteOne({"email": req.params.email});
    res.sendStatus(200);
})


/*(19-387) Criar uma nova rota do tipo POST que meu teste ordena e que se chame /auth */
app.post("/auth", async (req, res) => {

    // Utilizando o operador de desestruturação
    let {email, password} = req.body;

/*(20-388) 1 TESTE DE VALIDAÇÃO 
Antes de gerar o JWT preciso fazer uma busca no banco de dados, vou usar o método findOne  porque
eu quero achar um único elemento*/
    let user = await User.findOne({"email": email})

// Se eu achar um usuário igual a  undefined ou seja (vazio)
    if(user == undefined){
        // O meu teste pede esse status quando um usuário nao identificado tentar se cadastrar
        res.statusCode = 403;
        // Meu teste pede um objeto de erros
        res.json({errors: {email: "E-mail não cadastrado"} });
        return;
    }
    
/*(21-388) 2 TESTE DE VALIDAÇÃO 
 Segundo teste de Validação utilizando o bcrypt eu vou comparar a senha que o usuário passar pra mim na 
 requisição com o banco de dados, onde contém o hash*/
    let isPasswordRight = await bcrypt.compare(password,user.password); // Vai me retornar um boolean (true or false)
    // Se a senha estiver errada
    if(!isPasswordRight){
        // Meu teste pede esse status de erro caso minha seja esteja errada
        res.statusCode = 403;
        res.json({errors: {password: "Senha incorreta"} });
        return;
    }
// Vou passar 3 parâmetros, essa função não da para trabalhar com uma promise, vou utilizar um callback
    // 22-388 Vou salvar o user.name user._id
    jwt.sign({email, name: user.name, id: user._id},JWTSecret,{expiresIn: '48h'}, (err, token) => {
        // Se acontecer algum erro
        if (err){
            res.sendStatus(500);
            console.log(err);
        // Se não
        }else{
        // Meu teste pede um campo token no corpo da requisição
            res.json({token});
        }
    })
});


//(5-376)                  [ EXPORTANDO A APLICAÇÃO ]
module.exports = app;

/* Toda a minha aplicação express fica dentro de uma única variável que é APP (2-376)
e estou exportando ela para usar em outros arquivos */