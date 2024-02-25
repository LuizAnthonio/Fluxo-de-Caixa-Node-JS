const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Tools = require("./tools/tools");

const app = express();


//Transformando ejs em html
app.engine('html',require('ejs').renderFile);
app.set('views engine','html');

app.use(express.static('public'));
app.use(express.static(__dirname + '/public'))

//usando BodyParser
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({
    extended: true
}));


//console.log("ola")


console.table(Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv")))

app.get("/", (req,res) => {
    
    const dados = Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv"))
    
    res.json(dados)
    
});

app.post("/",(req,res) => {
    const dados = Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv"))
    
    let tipo = req.body.tipo;
    let valor = req.body.valor;

    let dadosFiltrados;
    
    switch(tipo){
        case 1:
            tipo = "saida"
            tipo === 'saida' ? dadosFiltrados = dados.filter(e => e.tipo === tipo) : 0;
            break;
        case 0:
            tipo = "entrada";
            tipo === 'entrada' ? dadosFiltrados = dados.filter(e => e.tipo === tipo) : 0;
            break;
        default:
            tipo = "";
            break;
    }
    
    valor > 0 ? dadosFiltrados = dados.filter(e => e.valor >= valor && e.tipo === tipo) : 0;

    tipo === "" ? dadosFiltrados = dados.filter(e => e.valor >= valor ) : 0;


    const dadosFinais = {quantidade:dadosFiltrados.length, dados: dadosFiltrados}

    //console.log("tipo ",tipo)

    res.json(dadosFinais);


})


app.get("/:ano", (req,res) => {
    const dados = Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv"))

    let ano = req.params.ano;

    let porAno = dados.filter(e => new Date(e.data).getFullYear() === parseInt(ano))

    const dadoCompleto = {
        qtd: porAno.length,
        dados: porAno
    }

    res.json(dadoCompleto)

})

app.post("/:ano", (req,res) => {
    const dados = Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv"))

    let ano = req.params.ano;
    let tipo = req.body.tipo;
    let valor = req.body.valor;

    let porAno = dados.filter(e => new Date(e.data).getFullYear() === parseInt(ano))
    
    let dadosFiltrados;
    
    switch(tipo){
        case 1:
            tipo = "saida"
            tipo === 'saida' ? dadosFiltrados = porAno.filter(e => e.tipo === tipo) : 0;
            break;
        case 0:
            tipo = "entrada";
            tipo === 'entrada' ? dadosFiltrados = porAno.filter(e => e.tipo === tipo) : 0;
            break;
        default:
            tipo = "";
            break;
    }
    
    valor > 0 ? dadosFiltrados = porAno.filter(e => e.valor >= valor && e.tipo === tipo) : 0;

    tipo === "" ? dadosFiltrados = porAno.filter(e => e.valor >= valor ) : 0;


    

    const dadoCompleto = {
        qtd: dadosFiltrados.length,
        dados: dadosFiltrados
    }

    res.json(dadoCompleto)

})


app.get("/relatorio/1", (req,res) => {

    const dadosEmMassa = Tools.formatarObj(Tools.criaObjeto("./dados/empresa.csv"))

    console.log("comparativo")
                let anos = []

                for(let i = 0; i < dadosEmMassa.length; i++){
                    if(!anos.includes(new Date(dadosEmMassa[i].data).getFullYear())){

                        
                            anos.push(new Date(dadosEmMassa[i].data).getFullYear());
                    
                    }
                }

                
                anos.shift()
                
                console.log(anos)

                let resultadoComparativo = []

                let saldoInicial = 0;
                let saldoInic = 0;
                
                for(let i = anos.length - 1; i >= 0; i--){
                    let anosDados = dadosEmMassa.filter(e => new Date(e.data).getFullYear() === anos[i]);
                    
                    let entradas = anosDados.filter(e => e.tipo === "entrada");
                    let saidas = anosDados.filter(e => e.tipo === "saida");
                    
                    let converteEntradas = entradas.map(e => parseFloat(e.valor));
                    let converteSaidas = saidas.map(e => parseFloat(e.valor_acumulado));
                    
                    let totEntradas = converteEntradas.reduce((a,b) => a+b,0);
                    let totSaidas1 = converteSaidas.reduce((a,b) => a+b,0);
                    
                    let margemDoAno = totEntradas - totSaidas1;

                    //console.log(totEntradas,totSaidas1,margemDoAno)
                    //let saldoInicial = 0;

                    let saldoFinal = 0;


                    if(i < anos.length - 1){
                        //saldoInic = margemDoAno;
                        saldoInicial += saldoInic;
                        saldoFinal = saldoInicial + margemDoAno;

                    }else{
                        saldoInic = margemDoAno;
                        saldoInicial = 0;
                        saldoFinal = saldoInic;
                    }

                    
                    


            
                    resultadoComparativo.push({entradas:totEntradas.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saidas:totSaidas1.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),margem:margemDoAno.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saldo_inicial:saldoInicial.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saldo_final:saldoFinal.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),ano:anos[i]})
                    
            
                    
                }

                resultadoComparativo.sort((a,b) => {
                    if (a.ano < b.ano) {
                        return -1;
                    }
                    if (a.ano > b.ano) {
                        return 1;
                    }
                    return 0;
                })
                
             
                
                //console.table()
                res.json(resultadoComparativo)
                //res.json({ok:olha})


})





const port = 8000;

app.listen(port,() => {


    console.log("http://localhost:8000/");

})