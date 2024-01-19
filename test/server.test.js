/*                              Aula (376) Preparando Base 
                                Aula (377) Conexão com o Mongo 
 */
//(1-376) importando a instância do meu aplicativo que se chama (APP)
let app = require("../src/app");
//(2-376) carregar o supertest
let supertest = require("supertest");
//(3-376) criando um objeto de requisição e passar a instância do meu aplicativo (1-376)
let request = supertest(app);



//                      [ PROMISE DE TEST PRECIA DE UM RETURN NA FRENTE ! ;) ]


test("A aplicação deve responder na porta 3131", () => {

    try{
         request.get("/").then(res => {
            let status = res.statusCode
            expect(status).toEqual(200);
        })
    }catch(err){
        fail(err)
    }

})



/*(4-376) ESCREVER O TESTE ANTES DA FUNCIONALIDADE
test("A aplicação deve responder na porta 3131", async () => {
    // vou fazer uma requisição para a rota principal da aplicação 
     await request.get("/").then(res => {
    //e quero que a resposta seja (STATUSCODE 200)
        let status = res.statusCode
        expect(status).toEqual(200);
    // caso o teste falhar vou chamar a função fail
        }).catch(err => {
        fail(err)
    });
});
*/