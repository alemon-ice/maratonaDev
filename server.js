//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar o corpo do formulário
server.use(express.urlencoded({extended: true}))

//configurar a conexão com o BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'passBD',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configurar a apresentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        //fluxo de erro
        if(err) return res.send("Erro no BD!")

        //fluxo ideal
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //regras de negócio
    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!")
    }

    //adicionar valores dentro do bd
    const query = `
                    INSERT INTO donors ("name", "email", "blood")
                    VALUES ($1, $2, $3)
                  `
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if(err) return res.send("Erro no BD!")

        //fluxo ideal
        return res.redirect("/")
    })
})

// ligar servidor e permitir acesso na porta 3000
server.listen(3000, function(params) {
    console.log("Servidor iniciado")
})