
// TODO: Variable global

let presupuesto = 0;

let gastos = [];

let idGasto = 0;

function actualizarPresupuesto(num) {
    // TODO

    if(num >= 0 && typeof num === "number")
    {

        presupuesto = num;
        return presupuesto;

    }
    else
    {

        console.log("Error, el numero introducido es negativo");
        return -1;
   }
}

//Revisar
function mostrarPresupuesto() {
    // TODO
    return(`Tu presupuesto actual es de ${presupuesto} €`);

}
// revisar
function CrearGasto(descripcion,valor, fecha = Date.now(), ...etiquetas) {

    this.descripcion = descripcion;

    this.etiquetas = [...etiquetas];

    if(valor >= 0 && typeof valor === "number")
    {

        this.valor = valor;

    }
    else
    {
        this.valor = 0;

    }
    
    if(typeof fecha === 'string' && !isNaN(Date.parse(fecha)))
    {

        this.fecha = Date.parse(fecha);

    }
    
    else
    {

        this.fecha = Date.now();

    }
    
    this.mostrarGasto = function()
    {

        return(`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`)

    };

    this.actualizarDescripcion = function(desc)
    {
        this.descripcion = desc;
    };

    this.actualizarValor = function(valorActualizado){

        if(valorActualizado >= 0 && typeof valorActualizado === "number")
        {

            this.valor = valorActualizado;

        }

    }

    this.mostrarGastoCompleto = function(){

        let Gastos;

        let fechaMod = new Date(this.fecha);

        Gastos = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;

        Gastos += `Fecha: ${fechaMod.toLocaleString()}\n`;

        Gastos += `Etiquetas:\n`;

        for(let i = 0; i < this.etiquetas.length; i++)
        {

            Gastos += `- ${this.etiquetas[i]}\n`

        }

        return Gastos;

    }

    this.actualizarFecha = function(nuevaFecha){

        if(typeof nuevaFecha === 'string' && !isNaN(Date.parse(nuevaFecha)))
        {

            this.fecha = Date.parse(nuevaFecha);

        }

    }

    this.anyadirEtiquetas = function(...nuevaEtiqueta){

        let arrayC = [...this.etiquetas,...nuevaEtiqueta];

        let arrayM = new Set(arrayC);

        this.etiquetas = Array.from(arrayM);

    }

    this.borrarEtiquetas = function(...eliminarEtiquetas){

        let i = 0;
        let j = 0;

        while(i < this.etiquetas.length)
        {

            while(j < eliminarEtiquetas.length)
            {

                if(this.etiquetas[i] === eliminarEtiquetas[j])
                {

                    this.etiquetas.splice(i,1);
                    i--;
                }
                j++;

            }
            j=0;
            i++;

        }

    }

    this.obtenerPeriodoAgrupacion = function(format) {
        
        let group = "";

        let fecha = new Date(this.fecha);

        if(format === 'dia')
        {

            group += fecha.getFullYear() + "-";


            if((fecha.getMonth() + 1) < 10)
            {

                group += "0" + (fecha.getMonth() + 1) + "-";

            }
                else{

                    group += (fecha.getMonth() + 1) + "-";

                }

            if(fecha.getDate() < 10)
            {

                group += "0" + fecha.getDate();

            }
                else{

                    group += fecha.getDate();

                }
        }

        if(format === 'mes')
        {

            group += fecha.getFullYear() + "-";

            if((fecha.getMonth() + 1) < 10)
            {

                group += "0" + (fecha.getMonth() + 1);

            }
                else
                {

                    group += (fecha.getMonth() + 1);
                    
                }

        }

        if(format === 'anyo')
        {

            group += fecha.getFullYear();

        }

        return group;

    }

}

function listarGastos()
{

    return(gastos);

}

function anyadirGasto(gasto)
{

    gasto.id = idGasto; //añade la nueva clave al objeto llamado gasto que lo pasa como parámetro     
    idGasto++;
    gastos.push(gasto);

}

function borrarGasto(id)
{
        for(let i = 0; i < gastos.length; i++)
        {
            if(gastos[i].id === id)
            {
                gastos.splice(i,1)
            }
        }
}

function calcularTotalGastos()
{

    let totalGastos = 0;

    for(let i = 0; i < gastos.length; i++)
    {

        totalGastos += gastos[i].valor;

    }

    return totalGastos;

}

function filtrarGastos({fechaDesde, fechaHasta, valorMinimo, valorMaximo, descripcionContiene, etiquetasTiene})
{

    let arrayFilter = gastos.filter(function(gasto){

        let anyadir = true;

        let comprobacion = false;
    
            if(gasto.fecha < Date.parse(fechaDesde))
            {

                anyadir = false;

            }

            if(gasto.fecha > Date.parse(fechaHasta))
            {

                anyadir = false;

            }
        
            if(gasto.valor < valorMinimo)
            {

                anyadir = false;

            }
        
            if(gasto.valor > valorMaximo)
            {

                anyadir = false;

            }
        
            if(descripcionContiene)
            {

                let desc = gasto.descripcion.toLowerCase();
                let content = descripcionContiene.toLowerCase();

                if(!desc.includes(content))
                {

                    anyadir = false;

                }
                
            }

            if(etiquetasTiene)
            {
                
                for(let i = 0; i < etiquetasTiene.length; i++)
                {

                    for(let j = 0; j < gasto.etiquetas.length; j++)
                    {

                        if(etiquetasTiene[i] === gasto.etiquetas[j])
                        {

                            comprobacion = true;

                        }            

                    }   

                }
                if(comprobacion === false)
                {

                    anyadir = false;

                }

            }

            return anyadir;

        }
        );

        return arrayFilter;

}

function agruparGastos(periodos = 'mes', etiquetas, fechaDesde, fechaHasta){

    let objetoFiltro = {

        fechaDesde:fechaDesde,
        fechaHasta:fechaHasta,
        etiquetasTiene:etiquetas,

    }

    let filtro = filtrarGastos(objetoFiltro);

    let funcionAcumulador = filtro.reduce(function(acumulador, actual){

        if(isNaN(acumulador[actual.obtenerPeriodoAgrupacion(periodos)]))
        {

            acumulador[actual.obtenerPeriodoAgrupacion(periodos)] = 0;

        }

        acumulador[actual.obtenerPeriodoAgrupacion(periodos)] += actual.valor;

        return acumulador;

    },{});
    return funcionAcumulador;

}

function transformarListadoEtiquetas(etiquetaHas)
{

    let etiquetasTrans = etiquetaHas.match(/[a-z0-9]+/gi);

    return etiquetasTrans;

}


function calcularBalance()
{

    let totalBalance = 0;

    let gasto = calcularTotalGastos();

    totalBalance = presupuesto - gasto;

    return totalBalance;

}

function cargarGastos(gastosAlmacenamiento) {
    // gastosAlmacenamiento es un array de objetos "planos"
    // No tienen acceso a los métodos creados con "CrearGasto":
    // "anyadirEtiquetas", "actualizarValor",...
    // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
  
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let g of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
        // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento
        // al gasto rehidratado
        // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
        Object.assign(gastoRehidratado, g);
        // Ahora "gastoRehidratado" tiene las propiedades del gasto
        // almacenado y además tiene acceso a los métodos de "CrearGasto"
          
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado)
    }
}
    

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
mostrarPresupuesto,
actualizarPresupuesto,
CrearGasto,
listarGastos,
anyadirGasto,
borrarGasto,
calcularTotalGastos,
calcularBalance,
filtrarGastos,
agruparGastos,
transformarListadoEtiquetas,
cargarGastos
}