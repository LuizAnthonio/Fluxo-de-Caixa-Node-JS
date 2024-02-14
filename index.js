const fs = require("fs");
const scan = require('readline-sync');




const filePath = "dados.csv"



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


while(sair < 3){

    
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
    
    
    
    sair = scan.questionInt("sair? ");

    if(sair == 2){
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
        
        for(let i = 0; i < anos.length; i++){
            let anosDados = dadosEmMassa.filter(e => new Date(e.data).getFullYear() === anos[i]);
            
            let entradas = anosDados.filter(e => e.tipo === "entrada");
            let saidas = anosDados.filter(e => e.tipo === "saida");
            
            let converteEntradas = entradas.map(e => parseFloat(e.valor));
            let converteSaidas = saidas.map(e => parseFloat(e.valor_acumulado));
            
            let totEntradas = converteEntradas.reduce((a,b) => a+b,0);
            let totSaidas1 = converteSaidas.reduce((a,b) => a+b,0);
            
            let margemDoAno = totEntradas - totSaidas1;
            
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
            
            
            resultadoComparativo.push(objetosFab(["total_de_entradas","total_de_saidas","margem_do_ano","ano"],linha));
            
            //let converte = anosDados.map(e => e.valor);
            
            
        }
        
        
        console.table(resultadoComparativo)


    }
    
}
    
    


    
    
    
    /*

const dadosParaAnalise = dadosEmMassa.map(e => {
  
    let oia = new Date(e.data)



    

    console.log(oia.getFullYear())
    
})



console.log(pergunta)
*/










