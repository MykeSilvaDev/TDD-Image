/**                     Aula 378 este Cadastro de Usuário 
 *                      Aula 380 Teste de Validação 
 *                      Aula 381 Teste de e-mail repetido 
 *                      Aula 385 Usuário Principal 
 *                      Aula 386 Teste de JWT 
 *                      Aula 388 Teste - Validação de Login 
 *                      
 *                      
 */


//(1-378) importando a instância do meu aplicativo que se chama (APP)
let app = require("../src/app");
//(2-378) carregar o supertest
let supertest = require("supertest");
//(3-378) criando um objeto de requisição e passar a instância do meu aplicativo (1-376)
let request = supertest(app);


/*(6-385) Criando objeto (usuário principal) */
let mainUser = {name: "JWT-json", email: "jwtjwt.com.br", password: "123456"}

/*(7-385)*/
beforeAll(() =>{
    // Inserir usuário Myke no banco
    return request.post("/user")
    .send(mainUser)
// Só estou colocando o then para que a promise execute corretamente não é necessário inserir (expect)
    .then(res => {})
    .catch(err => {console.log(err)})
});

/*(8-385) Após todos os testes for realizados eu vou remover esse usuário no banco, Após todos os testes
forem concluídos, vou chamaro o objeto request fazendo uma requisição delete para a rota chamada /user
atráves da concatenação vou passar o mainuser.email*/
afterAll(() => {
    // PODERIA FAZER DESSA FORMA ->  (`/user/${mainUser.email}`)
    return request.delete("/user/" + mainUser.email) 
    .then(res => {})
    .catch(err => {console.log(err)})
});


describe("Cadastro de Usuário", () => {
    test("Deve cadastrar um usuário com Sucesso", () => {
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "Myke", email, password: "123456"};
        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.body.email).toEqual(email)
            expect(res.statusCode).toEqual(200);
            console.log("Teste Passou com Sucesso!")
        }).catch(err => {
            fail(err)
           
        });
    });

    /*(4-380) Esse teste espera uma falha, pois estou enviando dados vazios para essa rota, ou seja
sua aplicação está deixando cadastrar os dados vazios de doa MANO*/
    test("Deve impedir que usuários se cadastre com dados vazios", () =>{
        
        let user = {name: "", email:"", password: ""};
        return request.post("/user")
        .send(user)
        .then(res => {
/*Meu teste espera que o statusCode seja 400 */
            expect(res.statusCode).toEqual(400); // 400 = Bad Request é quando usuário envia dados inválidos    
            console.log("Teste Passou com Sucesso!")
        }).catch(err => {
            fail(err)
        });
    });

/*(5-381) Meu teste tem 2 partes, estou tentando cadastrar o mesmo usuário duas vezes */
    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {
        //Nesse teste estou gerando :
        let time = Date.now();
        // EMAIL
        let email = `${time}@gmail.com`;
        // OBJETO DE USUÁRIO
        let user = {name: "Myke", email, password: "123456"};

        // 1° Requisição eu quero que o usuário seja cadastrado com sucesso
        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email)
          
        /* 2° Requisição quero mandar o mesmo usuário para essa mesma rota, com o mesmo usuário com o mesmo email
mas quero que a resposta seja diferente (BAD REQUEST 400) e além disso o erro que printe (email já cadastrado)        */
        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual("E-mail já cadastrado");
        }).catch(err => {
            fail(err)
        });
        }).catch(err => {
            fail(err);
        });
    })
});

/*(9-386) Teste de Autenticação*/
describe("Autenticação", () => {
    test("Deve me retornar um token quando logar", () => {
        // Chamando o objeto de request (Vou fazer uma requisição para a rota post)
        return request.post("/auth")
        // Para essa rota eu vou mandar os dados de e-mail e senha que eu preciso logar
        // Estou puxando os dados desse usuário principal (mainUser) 6-385 name: "JWT-json", email: "jwtjwt.com.br", password: "123456" 
        // E mandá-los para o meu back-end
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            // Espero que a minha respota seja 200
            expect(res.statusCode).toEqual(200);
            // Epero que receba um dado no corpo da respota chamado token
            // Preciso que o token nao seja undefined (NÃO QUERO UM TOKEN VAZIO)
            // O método toBeDefined garante que eu receba a variável token
            expect(res.body.token).toBeDefined()
        }).catch(err => {
            fail(err);
        })
    })

/*(10-388) */

// 1º TESTE

    test("Deve impedir que um usuário não cadastrado se logue", () => {
/* Vou enviar uma requisição para a rota /auth eu vou mandar um email que não existe */
        return request.post("/auth")
        // Para essa rota eu vou mandar os dados de e-mail e senha que eu preciso logar
        // Estou puxando os dados desse usuário principal (mainUser) 6-385 name: "JWT-json", email: "jwtjwt.com.br", password: "123456" 
        // E mandá-los para o meu back-end
        .send({email: "umemailqualquer", password: "123456"})
        .then(res => {
            // Espero que a minha respota seja um erro (FORBBIDEN)
            expect(res.statusCode).toEqual(403);
            // Na hora de enviar um email inválido espero receber uma mensagem ERROR, vou receber um objeto 
            // de errors que vai receber a mensagem -> [E-mail não cadastrado]
            expect(res.body.errors.email).toEqual("E-mail não cadastrado");
        }).catch(err => {
            fail(err);
        })
    })

/*(11-388) */

// 2º TESTE

    test("Deve impedir que um usuário não se logue com uma senha errada", () => {
/* Vou enviar uma requisição para a rota /auth eu vou mandar um password que não existe */
        return request.post("/auth")
        // Para essa rota eu vou mandar os dados de assword e senha que eu preciso logar
        // Estou puxando os dados desse usuário principal (mainUser) 6-385 name: "JWT-json", email: "jwtjwt.com.br", password: "123456" 
        // E mandá-los para o meu back-end
        // Vou errar a senha de propósito
        .send({email: mainUser.email, password: "bolinha"})
        .then(res => {
            // Espero que a minha respota seja um erro (FORBBIDEN)
            expect(res.statusCode).toEqual(403);
            // Na hora de enviar um email inválido espero receber uma mensagem ERROR, vou receber um objeto 
            // de errors que vai receber a mensagem -> [E-mail não cadastrado]
            expect(res.body.errors.password).toEqual("Senha incorreta");
        }).catch(err => {
            fail(err);
        })
    })



});






































































































/*
    test("Deve cadastrar um usuário com sucesso", () => {
        let time = Date.now();
O teste vai rodar várias vezes e na maioria dos sistemas não aceita dois emails, para isso vou criar uma variável 
a cada vez que meu teste rodar o email será diferente
        let email =  `${time}@gmail.com`;
        let user = {name: "Myke", email, password: "123456"};
/*(5-378) Vou gerar um objeto de requisição (REQUEST) para a rota POST enviando os dados (4-378) 
        return request.post("/user")
        .send(user)
        .then(res => {
/* Essa é a forma de saber se um dado foi cadastrado com sucesso, se o email que eu recebi no retorno é igual
ao o email que eu enviei 
            expect(res.body.email).toEqual(email)
            expect(res.statusCode).toEqual(200);

        }).catch(err => {
            
        })
    });
});
*/
