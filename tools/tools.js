const e = require("express");
const fs = require("fs");


class Tools{

    static lerArquivo(filePath) {
        const noArq = fs.readFileSync(filePath,"utf-8");
        const arrayDoArq = noArq.split("\n");

        return arrayDoArq;
        
    }

    static criaObjeto(filePath){

        let listaDeObjetos = [];
        
        let header = this.lerArquivo(filePath)[0].split(",");
        let dadosCompletos = this.lerArquivo(filePath)
        dadosCompletos.shift()
        
        
        for(let i = 0; i < dadosCompletos.length; i++){
            dadosCompletos[i].includes("\r") ? dadosCompletos[i] = dadosCompletos[i].split("\r")[0] : 0;
        }
        
        for(let i = 0; i < header.length; i++){
            header[i].includes("\r") ? header[i] = header[i].split("\r")[0] : 0;
        }
        
        //console.log(header)
        
        //console.log(dadosCompletos)
        for(let i = 0; i < dadosCompletos.length; i++){
            let oNovoObj = {};
            
            let arrObjeto = dadosCompletos[i].split(",");

            for(let j = 0; j < header.length; j++){

               // arrObjeto[j].includes("\r") ? arrObjeto[j] = arrObjeto[j].split("\r")[0] : 0;

                header[j].includes("\r") ? header[j] = header[j].split("\r")[0] : 0;
                
                header[j] = header[j].normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                header[j] = header[j].toLocaleLowerCase()

                header[j].includes("\n") ? header[j] = header[j].split("\n")[0] : 0;

                header[j].includes(" ") ? header[j] = header[j].split(" ").join("_") : 0;

   

                oNovoObj[`${header[j]}`] = arrObjeto[j]
            }

            oNovoObj.id != null && listaDeObjetos.push(oNovoObj);

        }

        //console.log(listaDeObjetos)

        return listaDeObjetos;

    }

    static formatarObj(objetos){
        
        return objetos.map(e => ({
            nome:e.nome,
            telefone: e.telefone,
            id: parseInt(e.id),
            tipo: e.tipo,
            valor: parseFloat(e.valor),
            data: e.data,
            valor_acumulado: parseFloat(e.valor_acumulado),
            nome_despesa: e.nome_despesa
        }))
    }


}

module.exports = Tools;