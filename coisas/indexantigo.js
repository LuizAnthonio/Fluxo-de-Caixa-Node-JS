const fs = require("fs");
const scan = require('readline-sync');




const filePath = "../dados/empresa.csv"



const arquivo = fs.readFileSync(filePath,"utf-8")

//console.log(arquivo)

let tomele = arquivo.split("\n");
let header = tomele[0];

//console.log(tomele.shift())
//console.log(tomele)

let novosDados = [];

tomele.map(e => {
    if(e.includes("\r")){
        novosDados.push(e.split("\r")[0]);
        
    }
})



//console.log(novosDados)
//console.log(header.split(","))

function compararPorAno(a, b) {
    if (a.ano < b.ano) {
        return -1;
    }
    if (a.ano > b.ano) {
        return 1;
    }
    return 0;
}

function objetosFab(cabecalho,dados){

    obj = {};
    let numeroDeCulunas = cabecalho.length;

    let dadoPorCuluna = dados.split(",");

    for(let i = 0; i < numeroDeCulunas; i++){

        if(cabecalho[i].includes("\r")){
            obj[`${cabecalho[i].split("\r")[0]}`] = dadoPorCuluna[i];

        }else{
            obj[`${cabecalho[i]}`] = dadoPorCuluna[i];

        }

    }

    return obj;

}


let dadosEmMassa = []

for(let i = 0; i < novosDados.length; i++){

  let indv =  objetosFab(header.split(","),novosDados[i]);
    
  dadosEmMassa.push(indv);

}



//console.log(dadosEmMassa)

let sair = 0;
let opcao = 0;

while(sair < 3){

    opcao = scan.questionInt("Escolha uma opcao: ");

    switch(opcao){
        case 1:
            console.log("Relatório por ano")
            let ano = scan.question("Qual o ano? ")
    
            const filtro_por_ano = dadosEmMassa.filter(e => new Date(e.data).getFullYear() === parseInt(ano))
            
            console.table(filtro_por_ano)

            const valAcum = filtro_por_ano.filter(e => parseFloat(e.valor_acumulado) != 0.0)

            const entradas_do_ano = filtro_por_ano.filter(e => e.tipo === "entrada");

            const valtot = entradas_do_ano.map(e => parseFloat(e.valor))

            const valAcumTot = valAcum.map(e => parseFloat(e.valor_acumulado))

            const totValAcum = valAcumTot.reduce((a,b) => a+b,0)
            const totValEn = valtot.reduce((a,b) => a+b,0)





            let somaAno = totValEn - totValAcum;

            
            console.log(somaAno.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }))
            

            let tipoSelc = scan.question("Digita o tipo 'e' ou 's' ");


            
            let tip = "entrada";
            let filtro_por_tipo_e_ano = 0; 
            
            if(tipoSelc === "s"){
                tip = "saida";
                //filtro_por_tipo_e_ano = totValAcum;



            }
            
            
            
            filtro_por_tipo_e_ano = filtro_por_ano.filter(e => e.tipo === tip )
            
            let convertido_filtro_AnoeTipo = 0;
            if (tipoSelc === "s"){
                convertido_filtro_AnoeTipo = filtro_por_tipo_e_ano.map(e =>  parseFloat(e.valor_acumulado)) 
                
            }else{
                
                convertido_filtro_AnoeTipo = filtro_por_tipo_e_ano.map(e =>  parseFloat(e.valor)) 
            }
            const total_filtro_AnoeTipo = convertido_filtro_AnoeTipo.reduce((a,b) => a+b,0)
            
            console.table(filtro_por_tipo_e_ano);
            
            
            console.log(total_filtro_AnoeTipo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }))
            
            
            break;

            //sair = scan.questionInt("sair? ");

            case 2:
                console.log("comparativo")
                let anos = []

                for(let i = 0; i < dadosEmMassa.length; i++){
                    if(!anos.includes(new Date(dadosEmMassa[i].data).getFullYear())){

                        
                            anos.push(new Date(dadosEmMassa[i].data).getFullYear());
                    
                    }
                }

                anos.shift()
                
                //console.log(anos)

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

                    
                    


                    /*
                    let linha = `${totEntradas.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })},${totSaidas1.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })},${margemDoAno.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })},${anos[i]}`;
                    */
                    resultadoComparativo.push({entradas:totEntradas.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saidas:totSaidas1.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),margem:margemDoAno.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saldo_inicial:saldoInicial.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),saldo_final:saldoFinal.toLocaleString("pt-BR",{style: 'currency',currency: 'BRL'}),ano:anos[i]})
                    
                // let objeto = 
                    
                    //resultadoComparativo.push(objetosFab(["total_de_entradas","total_de_saidas","margem_do_ano","ano"],linha));
                    
                    //let converte = anosDados.map(e => e.valor);
                    
                    
                }

                resultadoComparativo.sort(compararPorAno)
                
                
                console.table(resultadoComparativo)

                break;


                case 3:
                    sair = 8;

                case 4:

                    let tudo = []
                    let headers = []

                    const desps = dadosEmMassa.filter(e => e.tipo === "saida")

                    //console.log(desps)

                    let segmentos = desps.map(e => {
                        obj = {}
                        
                        obj[`${e.nome_despesa}`] = parseFloat(e.valor_acumulado);
                        obj.valor = parseFloat(e.valor_acumulado);
                        obj.tag = e.nome_despesa;

                        return obj;

                    }) 

                    for(let i = 0; i < segmentos.length; i++){
                        if(!headers.includes(segmentos[i].tag)){
                            headers.push(segmentos[i].tag)
                        }

                    }



                    let oNovoObj = headers.map(e => {
                        let obj = {};
                    
                        let val = segmentos.filter(a => a.tag === e);
                        obj[`${e}`] = val.map(o => o.valor);
                        obj.total = obj[`${e}`].reduce((a,b) => a+b,0)
                        obj.tag = e

                        return obj;
                    })

                    
                    
                    
                    

                    //console.log(oNovoObj[0])

                    let relatorioDesps = []


                    for(let i = 0; i < oNovoObj.length; i++){
                        //console.log(oNovoObj[i].tag,oNovoObj[i].total.toLocaleString("pt-BR", {style: "currency", currency:"BRL"}))
                    

                        let dado = {}

                        dado[`${oNovoObj[i].tag}`] = oNovoObj[i].total.toLocaleString("pt-BR", {style: "currency", currency:"BRL"})

                        relatorioDesps.push(dado)
                        

                    }



                    console.log(relatorioDesps)



            
            default:
                console.log("bou")


            

    }


    
}
    
    


    
    
    
    /*

const dadosParaAnalise = dadosEmMassa.map(e => {
  
    let oia = new Date(e.data)



    

    console.log(oia.getFullYear())
    
})



console.log(pergunta)
*/










