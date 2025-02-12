'use strict';

import * as gesPresupuesto from "./gestionPresupuesto.js";

function mostrarDatoEnId(valor, idElemento)
{

    if (idElemento != undefined)
    {
        let elemento = document.getElementById(idElemento);
        elemento.innerHTML += " " + valor;
    }

}

function mostrarGastoWeb(idElemento, gasto)
{

    let elemento = document.getElementById(idElemento);
    let divGasto = document.createElement('div');

    divGasto.className = "gasto";
    
    let divDescripcionPorGasto = document.createElement('div');
    divDescripcionPorGasto.className = "gasto-descripcion";
    divDescripcionPorGasto.innerHTML += gasto.descripcion;
    divGasto.append(divDescripcionPorGasto);

    let divFechaPorGasto = document.createElement('div');
    divFechaPorGasto.className = "gasto-fecha";
    divFechaPorGasto.innerHTML+=gasto.fecha;
    divGasto.append(divFechaPorGasto);

    let divValorPorGasto = document.createElement('div');
    divValorPorGasto.className = "gasto-valor";
    divValorPorGasto.innerHTML+=gasto.valor;
    divGasto.append(divValorPorGasto);

    let divEtiquetasPorGasto = document.createElement('div');
    divEtiquetasPorGasto.className = "gasto-etiquetas";
    
    for(let i = 0; i < gasto.etiquetas.length; i++){

        let divEtiquetaNuevoGasto = document.createElement('span');

        divEtiquetaNuevoGasto.className = "gasto-etiquetas-etiqueta";
        divEtiquetaNuevoGasto.textContent = gasto.etiquetas[i];
        
        let BtnEtiqBorrarHandle = new BorrarEtiquetasHandle();
        BtnEtiqBorrarHandle.gasto = gasto;
        BtnEtiqBorrarHandle.etiquetas = gasto.etiquetas[i];
        divEtiquetaNuevoGasto.addEventListener("click", BtnEtiqBorrarHandle);
        divEtiquetaNuevoGasto.textContent = gasto.etiquetas[i] + " ";
        divEtiquetasPorGasto.append(divEtiquetaNuevoGasto);
        
    }
    divGasto.append(divEtiquetasPorGasto);
    elemento.append(divGasto);
    
    
    let btnEditar = document.createElement("button");
    
    btnEditar.className = "gasto-editar";
    
    btnEditar.type = "button";
    
    btnEditar.innerHTML = "Editar";

    
    let BtnEditarHandle = new EditarHandle();
    
    BtnEditarHandle.gasto = gasto;
    
    btnEditar.addEventListener("click", BtnEditarHandle);
    
    divGasto.append(btnEditar);
    

    let btnBorrar = document.createElement("button");
    
    btnBorrar.className = "gasto-borrar";
    
    btnBorrar.type = "button";
    
    btnBorrar.innerHTML = "Borrar";

    
    let BtnBorrarHandle = new BorrarHandle();
    
    BtnBorrarHandle.gasto = gasto;
    
    btnBorrar.addEventListener("click", BtnBorrarHandle);
    
    divGasto.append(btnBorrar);


    let btnEditarForm = document.createElement('button');
   
    btnEditarForm.type = 'button';
   
    btnEditarForm.className = 'gasto-editar-formulario';
   
    btnEditarForm.textContent = 'Editar (formulario)';


    let editarForm = new EditarHandleFormulario(gasto);
    
    editarForm.gasto = gasto;
   
    btnEditarForm.addEventListener('click',editarForm);
    
    divGasto.append(btnEditarForm);


    let btnBorrarAPI = document.createElement('button');
   
    btnBorrarAPI.type = 'button';
   
    btnBorrarAPI.className = 'gasto-borrar-pai';
   
    btnBorrarAPI.textContent = 'Borrar (API)';


    let borrarAPI = new borrarGastosAPI(gasto);
    
    borrarAPI.gasto = gasto;
   
    btnBorrarAPI.addEventListener('click',borrarAPI);
    
    divGasto.append(btnBorrarAPI);

};

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo)
{

    // Obtener la capa donde se muestran los datos agrupados por el período indicado.
    // Seguramente este código lo tengas ya hecho pero el nombre de la variable sea otro.
    // Puedes reutilizarlo, por supuesto. Si lo haces, recuerda cambiar también el nombre de la variable en el siguiente bloque de código
    var divP = document.getElementById(idElemento);
    // Borrar el contenido de la capa para que no se duplique el contenido al repintar
    divP.innerHTML = "";

        if(idElemento != undefined)
        {

            let id = document.getElementById(idElemento);

            let agrupacionDiv = document.createElement('div');

            agrupacionDiv.className = "agrupacion";

            let h1Div = document.createElement('h1');

            h1Div.innerHTML += `Gastos agrupados por ${periodo}`;
            agrupacionDiv.append(h1Div);

            for(let llave of Object.keys(agrup))
            {

                let divDatoAgrupado = document.createElement('div');
                divDatoAgrupado.className = "agrupacion-dato";

                let spanDatoAgrupado = document.createElement('span');
                spanDatoAgrupado.className = "agrupacion-dato-clave";

                spanDatoAgrupado.innerHTML += `${llave} -  `;

                let spanValorDatoAgrupado = document.createElement('span');
                spanValorDatoAgrupado.className = "agrupacion-dato-valor";

                spanValorDatoAgrupado.innerHTML += `${llave.valueOf()}`;

                agrupacionDiv.append(divDatoAgrupado);
                divDatoAgrupado.append(spanDatoAgrupado);
                divDatoAgrupado.append(spanValorDatoAgrupado);

            }

            id.append(agrupacionDiv);

         //   return id;
        
            // Estilos
            divP.style.width = "33%";
            divP.style.display = "inline-block";
            // Crear elemento <canvas> necesario para crear la gráfica
            // https://www.chartjs.org/docs/latest/getting-started/
            let chart = document.createElement("canvas");
            // Variable para indicar a la gráfica el período temporal del eje X
            // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
            let unit = "";
            switch (periodo) {
            case "anyo":
                unit = "year";
                break;
            case "mes":
                unit = "month";
                break;
            case "dia":
            default:
                unit = "day";
                break;
            }

            // Creación de la gráfica
            // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
            const myChart = new Chart(chart.getContext("2d"), {
                // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
                type: 'bar',
                data: {
                    datasets: [
                        {
                            // Título de la gráfica
                            label: `Gastos por ${periodo}`,
                            // Color de fondo
                            backgroundColor: "#555555",
                            // Datos de la gráfica
                            // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                            data: agrup
                        }
                    ],
                },
                options: {
                    scales: {
                        x: {
                            // El eje X es de tipo temporal
                            type: 'time',
                            time: {
                                // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                                unit: unit
                            }
                        },
                        y: {
                            // Para que el eje Y empieza en 0
                            beginAtZero: true
                        }
                    }
                }
            });
            // Añadimos la gráfica a la capa
            divP.append(chart);
}
}

function repintar()
{


    document.getElementById("presupuesto").innerHTML = "";
   
    document.getElementById("gastos-totales").innerHTML = "";
   
    document.getElementById("balance-total").innerHTML = "";
   
    document.getElementById("listado-gastos-completo").innerHTML = "";

    mostrarDatoEnId(gesPresupuesto.mostrarPresupuesto(), "presupuesto");
    mostrarDatoEnId(gesPresupuesto.calcularTotalGastos(), "gastos-totales");
    mostrarDatoEnId(gesPresupuesto.calcularBalance(), "balance-total");
   
    for(let gasto of gesPresupuesto.listarGastos()){

        mostrarGastoWeb("listado-gastos-completo",gasto);

    }

    document.getElementById("agrupacion-dia");
    gesPresupuesto.agruparGastos("agrupacion-dia",mostrarGastosAgrupadosWeb());

    document.getElementById("agrupacion-mes");
    gesPresupuesto.agruparGastos("agrupacion-mes",mostrarGastosAgrupadosWeb());

    document.getElementById("agrupacion-anyo");
    gesPresupuesto.agruparGastos("agrupacion-anyo",mostrarGastosAgrupadosWeb());
}

function actualizarPresupuestoWeb()
{

    let question = prompt("introduce un presupuesto");
    
    let questionFloat = parseFloat(question);

    gesPresupuesto.actualizarPresupuesto(questionFloat);

    repintar();

}

let btnActualizarPresupuesto = document.getElementById('actualizarpresupuesto');
btnActualizarPresupuesto.addEventListener('click', actualizarPresupuestoWeb);

function nuevoGastoWeb()
{

    let descripcion = prompt("introduce una descripcion");

    let strValor = prompt("introduce un valor de el gasto");

    let valor = parseFloat(strValor);

    let date = prompt("introduce una fecha (formato yyy-mm-dd)");

    let fecha = Date.parse(date);

    let etiquetasarray = prompt('Etiquetas:').split(',');

    let crearGasto = new gesPresupuesto.CrearGasto(descripcion, valor, fecha, etiquetasarray);

    gesPresupuesto.anyadirGasto(crearGasto);

    repintar();

}

let btnAddGasto = document.getElementById('anyadirgasto');
btnAddGasto.addEventListener('click', nuevoGastoWeb);

function EditarHandle()
{

    this.handleEvent= function() 
    {
           
        let descripcion = prompt("introduce una descripcion");
       
        let strValor = prompt("introduce un valor para el gasto");
       
        let valor = parseFloat(strValor);
       
        let date = prompt("introduce una fecha en yyyy-mm-dd para el gasto");
       
        let etiquetas = prompt("introduce unas etiquetas para el gasto en fomato etiq1,etiq2,etiq3");
       
        etiquetas = etiquetas.split(',');

        this.gasto.actualizarValor(valor);
        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarFecha(date);
        this.gasto.anyadirEtiquetas(etiquetas);

        repintar();
    }

}

function BorrarHandle()
{

    this.handleEvent = function()
    {

        gesPresupuesto.borrarGasto(this.gasto.id);
        
        repintar();

    }

}

function BorrarEtiquetasHandle()
{

    this.handleEvent= function() 
        {

            this.gasto.borrarEtiquetas(this.etiquetas);

            repintar();
            
        }

}

function nuevoGastoWebFormulario(){
    
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    
    var formulario = plantillaFormulario.querySelector("form");
   

        let controles = document.getElementById("controlesprincipales");
 
        controles.append(formulario);


        document.getElementById("anyadirgasto-formulario").setAttribute('disabled', "");


        let cancelar = new btnCancelarHandle();
        
        let botonCancelar = formulario.querySelector("button.cancelar")
        
        botonCancelar.addEventListener('click',cancelar);


        let enviar = new enviarFormHandle();
        
        formulario.addEventListener('submit',enviar);


        let enviarApi = formulario.querySelector("button.gasto-enviar-api");

        enviarApi.addEventListener('click', new enviarGastosAPI());

};

function btnCancelarHandle()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();

        event.currentTarget.parentNode.remove();

        document.getElementById("anyadirgasto-formulario").removeAttribute("disabled");

        repintar();

    }

}

function enviarFormHandle()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();

        let formularios = event.currentTarget;

        let descripcion = formularios.elements.descripcion.value;

        let valor = parseFloat(formularios.elements.valor.value);
    
        let date = formularios.elements.fecha.value;

        let etiqueta = formularios.elements.etiquetas.value;

        let gasto = new gesPresupuesto.CrearGasto(descripcion,valor,date,...etiqueta);

        gesPresupuesto.anyadirGasto(gasto);
        
        repintar();

        document.getElementById("anyadirgasto-formulario").removeAttribute("disabled");

    }

};

function EnviarHandle()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();

        let formularios = event.currentTarget;

        let descripcion = formularios.elements.descripcion.value;

        this.gasto.actualizarDescripcion(descripcion);


        let valor = parseFloat(formularios.elements.valor.value);

        this.gasto.actualizarValor(valor);

    
        let date = formularios.elements.fecha.value;

        this.gasto.actualizarFecha(date);


        let etiqueta = formularios.elements.etiquetas.value;

        this.gasto.anyadirEtiquetas(...etiqueta);
        
        repintar();
    }

}

function filtrarGastosWeb(){
  
    this.handleEvent = function(event)
      {
          event.preventDefault() 
    
          let descripcion = document.getElementById("formulario-filtrado-descripcion").value;
    
          let valorMinimo = parseFloat(document.getElementById("formulario-filtrado-valor-minimo").value);
    
          let valorMaximo = parseFloat(document.getElementById("formulario-filtrado-valor-maximo").value);
    
          let fechaDesde =  document.getElementById("formulario-filtrado-fecha-desde").value;
    
          let fechaHasta =  document.getElementById("formulario-filtrado-fecha-hasta").value;
    
          let etiquetas = document.getElementById("formulario-filtrado-etiquetas-tiene").value;
    
          let filtrar ={};
  
          if(0 < etiquetas.length)
          {
          
            filtrar.etiquetasTiene = gesPresupuesto.transformarListadoEtiquetas(etiquetas);
          
          }
          
          filtrar.descripcionContiene = descripcion;
          
          filtrar.valorMinimo = valorMinimo;
          
          filtrar.valorMaximo = valorMaximo;
          
          filtrar.fechaDesde = fechaDesde;
          
          filtrar.fechaHasta = fechaHasta;
          
          filtrar.etiquetas = etiquetas;
  
          document.getElementById("listado-gastos-completo").innerHTML = "";
          
          
          let gastosFiltrados = gesPresupuesto.filtrarGastos(filtrar);
  
          for(let gasto of gastosFiltrados){
              mostrarGastoWeb("listado-gastos-completo",gasto);
          };
      }
  }


function EditarHandleFormulario()
{

    this.handleEvent = function(event){

        event.preventDefault()

        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    
        var formularios = plantillaFormulario.querySelector("form");


        let controles = document.getElementById("controlesprincipales");
        
        controles.append(formularios);
    

        let btnFormulario = event.currentTarget;
        
        btnFormulario.append(formularios);


        formularios.elements.descripcion.value = this.gasto.descripcion;
        
        formularios.elements.valor.value = this.gasto.valor;
        
        formularios.elements.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0,10);
        
        formularios.elements.etiquetas.value = this.gasto.etiquetas;
        
        
        let cancelar = new btnCancelarHandle();
        
        let btnCancelar = formularios.querySelector("button.cancelar")
        
        btnCancelar.addEventListener('click',cancelar);


        let enviar = new EnviarHandle();
        
        enviar.gasto = this.gasto;
        
        formularios.addEventListener('submit',enviar);

        btnFormulario.setAttribute('disabled', "");


        let editarApi = new EditarGastoAPI();

        editarApi.gasto = this.gasto;
        
        formularios.querySelector("button.gasto-enviar-api")
        
        .addEventListener('click',editarApi);
        
    }

}

function guardarGastosWeb()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();

        localStorage.setItem('GestorGastosDWEC',JSON.stringify(gesPresupuesto.listarGastos()));

    }

}


function cargarGastosWeb()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();

        if(localStorage.getItem('GestorGastosDWEC') != null)
        {

            gesPresupuesto.cargarGastos(JSON.parse(localStorage.getItem('GestorGastosDWEC')));

        }

        else
        {

            gesPresupuesto.cargarGastos([]);

        }

        repintar();

    }

}

function cargarGastosAPI()
{

        let username = document.getElementById("nombre_usuario").value;

        let enlace = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${username}`;

        if(username != '')
        {

             fetch(enlace, {method: 'GET'}).then(response => response.json()).then(function(gastos)
            {

                gesPresupuesto.cargarGastos(gastos);

                repintar();

            })

            .catch(error => {console.log(error);

            });

        }
        else
        {

            console.log("error, no se han podido cargar los gastos");

        }

    }

    function borrarGastosAPI()
    {
    
        this.handleEvent = function(evento)
        {

            evento.preventDefault();

            let nombreUsuario = document.getElementById("nombre_usuario").value;

            let enlace = fetch(`https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombreUsuario}/${this.gasto.gastoId}`, {method:'DELETE'})
            
            .then (respuesta => {

                if(respuesta.ok)
                {

                    console.log('Gasto eliminado correctamente');

                    cargarGastosAPI();

                }
                else
                {

                    console.log('el gasto no ha podido ser borrado correctamente');

                }

            })

        }
    
    }      
    

    function enviarGastosAPI()
    {
       this.handleEvent = function(evento)
       {
 
            let userName = document.getElementById("nombre_usuario").value;
            
            let url =  `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${userName}`;
      
    
            if(userName != '')
            {
      
                let formulario = document.querySelector('#controlesprincipales form');
      
                let descripcion = formulario.elements.descripcion.value;
      
                let valor = parseFloat(formulario.elements.valor.value);
      
                let fecha = formulario.elements.fecha.value;
      
                let etiquetas = formulario.elements.etiquetas.value.split(',');
    

            let gasto = 
            {
            
                descripcion: descripcion,
            
                valor: valor,
            
                fecha: fecha,
            
                etiquetas: etiquetas,
            
            }
            
            fetch(url, {method: 'POST', body: JSON.stringify(gasto), headers: {'Content-type': 'application/json; charset=utf-8'}})
            .then(function(respuesta)
            {
            
                if(respuesta.ok
                    ){
            
                    console.log('Gasto creado correctamente.')  
            
                    cargarGastosAPI();
            
                }
            
                else
                {
            
                    console.log('Error, no se ha odido cargar el gasto');
            
                }   
            
            })
            
            .catch(errors => alert(errors));
        }

        
        else{
        
            console.log('intoduce un nombre en la API por favor');
        
        }
    }

    
};

function EditarGastoAPI()
{

    this.handleEvent = function(event)
    {

        event.preventDefault();


      let nombre = document.getElementById("nombre_usuario").value;

      let formulario = event.currentTarget.form;

      let descripcion = formulario.elements.descripcion.value;

      let valor = parseFloat(formulario.elements.valor.value);

      let fecha = formulario.elements.fecha.value;

      let etiquetas = formulario.elements.etiquetas.value.split(',');
      
      let GastoApi = 
      {

        descripcion: descripcion,

        valor: valor,

        fecha: fecha,

        etiquetas: etiquetas,

        }
      
      let promise = fetch(`https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombre}/${this.gasto.gastoId}/`, 

      {method: 'PUT', headers:{'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify(GastoApi)})

      .then (()=> cargarTodo())

      .then (console.log('Editado'));

    }

  }

  function cargarTodo(){
  
    let usename = document.getElementById("nombre_usuario").value;
  
    let enlace = fetch(`https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usename}`)

    .then (response => response.json())

    .then (response => {gesPresupuesto.cargarGastos(response);
        repintar();
    })
  }

//Botones

let btnGuardar = document.getElementById('guardar-gastos');

btnGuardar.addEventListener("click", new guardarGastosWeb);


let btnCargar = document.getElementById('cargar-gastos');

btnCargar.addEventListener("click", new cargarGastosWeb);


actualizarpresupuesto.addEventListener("click", actualizarPresupuestoWeb);

anyadirgasto.addEventListener("click", nuevoGastoWeb);


let addGastoForm = document.getElementById("anyadirgasto-formulario");

addGastoForm.addEventListener("click", nuevoGastoWebFormulario);


let btnEnviar = document.getElementById("formulario-filtrado");

btnEnviar.addEventListener("submit", new filtrarGastosWeb());


let btnCArgarApi = document.getElementById("cargar-gastos-api");

btnCArgarApi.addEventListener("click", cargarGastosAPI);

export{

    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    EditarHandle,
    BorrarHandle,
    BorrarEtiquetasHandle,
    nuevoGastoWebFormulario,
    btnCancelarHandle,
    enviarFormHandle,
    EditarHandleFormulario,
    EnviarHandle,
    filtrarGastosWeb,
    guardarGastosWeb,
    cargarGastosWeb,
    cargarGastosAPI,
    borrarGastosAPI,
    EditarGastoAPI

}