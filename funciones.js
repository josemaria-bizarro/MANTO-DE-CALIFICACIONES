function doGet()
{
    const html=HtmlService.createTemplateFromFile('Caratula');
    html.pubUrl="https://script.google.com/a/macros/ceeccafetales.edu.mx/s/AKfycbw_IdNQfEAGkQDQURBTtZhhoMD8DF03qTWaEE8vO3XI/dev";
    const salida=html.evaluate();
    return salida;
}

function include(nomarch)
{
    return HtmlService.createHtmlOutputFromFile(nomarch).getContent();
}

function obtieneOpcEdu()                // OBTIENE DATOS DE OPC EDU DE DB
{
    const opcEduOrria=bdCeec.getSheetByName("OPCIONES EDUCATIVAS");
    datuaOpcEdu=opcEduOrria.getDataRange().getDisplayValues();
    datuaOpcEdu.shift();
    return datuaOpcEdu;
}

function obtieneCicloEsc(wsIkasle)          //OBTIENE DATOS DE CICLO ESC DE DB
{
    /*const cicloEscOrria=bdCeec.getSheetByName("PERIODOS EDUCATIVOS");
    var azkenIlara= cicloEscOrria.getLastRow();
    var cicloPaso=cicloEscOrria.getRange(3,1,azkenIlara,3).getDisplayValues();*/

    //OBTIENE CORREO INSTITUCIONAL DEL ALUMNO PARA BUSCAR EN DB CALIFICACIONES
    var wsIkasleF=bdikasleDatuak.filter(ilara=>ilara[0]==wsIkasle)
    if(wsIkasleF.length>0)
    {
        ikasleCorreo=wsIkasleF[0][1];
    }
    else
    {
        console.log("error al obtener correo institucional de alumno")
        return datuaCicloEscArr;
    }

    var wcicloAnt="";
    var datuaCicloEsc=tablaCalDatuak.filter(ilara=>ilara[1]==ikasleCorreo);
    
    if (datuaCicloEsc.length>0)
    {
        var i=0;
        datuaCicloEsc.forEach(ilara => {
            if(wcicloAnt!=datuaCicloEsc[i][4])
            {
                datuaCicloEscArr.push([datuaCicloEsc[i][4]]);
                wcicloAnt=datuaCicloEsc[i][4];
            }
            i++
        });
        if(datuaCicloEscArr.length>0)
        {
            return datuaCicloEscArr;
        }
        else
        {
            console.log("error en filtro datos de ciclo / alumno")
            
        return datuaCicloEscArr;
        }
        ;
    }
    else    
    {
        console.log("filtro vacio ciclo escolar");
        return datuaCicloEscArr;
    }
    
}

function obtieneAsignatura(wsIkasle,wsciclo,wsParcial)                    // OBTIENE DATOS DE ASIGATURA DE DB EN FUNCION A ALUMNO Y PERIODO
{
    //OBTIENE LAS MATERIAS DE TABLA CALIFICACIONES SEGUN ALUMNO Y PERIODO y OPC EDUCA
    var wsIkasleF=bdikasleDatuak.filter(ilara=>ilara[0]==wsIkasle)
    if(wsIkasleF.length>0)
    {
        ikasleCorreo=wsIkasleF[0][1];
        ikasleOpcEdu=wsIkasleF[0][9];
    }
    else
    {
        console.log("error al obtener correo institucional de alumno")
    }
    //determina las asignaturas cursadas por el alumno
    var materiasPerido=tablaCalDatuak.filter(ilara=>ilara[1]==ikasleCorreo&&ilara[4]==wsciclo&&ilara[5]==wsParcial);
    var datuaAsigna=[];
    if(materiasPerido.length>0)
    {
        //Obtiene materias según opcEdu y periodo
        asignaPaso=bdAsigna.getDataRange().getDisplayValues();
        asignaPaso.shift()
        //busca el nombre de cada asignatura del periodo y parcial
        materiasPerido.forEach(fila=>{
            var wsAsigna=asignaPaso.filter(ilara=>ilara[3]==ikasleOpcEdu&&ilara[0]==fila[6]);
            if(wsAsigna.length>0)
            {
                datuaAsigna.push([wsAsigna[0][2]])
            }
            else
            {
                console.log("Error al buscar asignatura "+fila[0][6]+" en el periodo "+wsciclo+" del alumno "+wsIkasle)
            }
        })
        
        if(datuaAsigna.length>0)
        {
            return datuaAsigna;
            
        }
        else
        {
            console.log("Array asignatura vacio");
        }
    }
    else
    {
        console.log("Alumno "+wsIkasle+" sin materias en el periodo "+wsciclo)
    }
    return datuaAsigna;
}

function DataAlumnos()
{
    
  var ikasle= bdikasleOrria.getDataRange().getDisplayValues(); 
  const dataAlumnos =ikasle.filter(ilara=>ilara[13]=="ACTIVO")
  dataAlumnos.shift();
  
return dataAlumnos;

}

function obtieneDatosTabla(wsIkasle,wsciclo,wsParcial,nomAsig)
{
    //Obtiene correo del alumno para buscar en tabla calificaciones
    var wsIkasleF=bdikasleDatuak.filter(ilara=>ilara[0]==wsIkasle)
    if(wsIkasleF.length>0)
    {
        ikasleCorreo=wsIkasleF[0][1];
        ikasleOpcEdu=wsIkasleF[0][9];
    }
    else
    {
        console.log("error al obtener correo institucional de alumno")
    }

    //Obtiene la clave de la materia
    asignaPaso=bdAsigna.getDataRange().getDisplayValues();
    var wsAsigna=asignaPaso.filter(ilara=>ilara[3]==ikasleOpcEdu&&ilara[2]==nomAsig);
    if(wsAsigna.length>0)
    {
        var wsAsignaCve=wsAsigna[0][0]
    }
    else
    {
        console.log("Error al buscar asignatura "+nomAsig+" del alumno "+wsIkasle)
        return

    }
    
    var datuaTabla=[];
    //Obtiene la calificacion de la tabla y la URL de la lista
    var materiasPerido=tablaCalDatuak.filter(ilara=>ilara[1]==ikasleCorreo&&ilara[4]==wsciclo&&ilara[5]==wsParcial&&ilara[6]==wsAsignaCve);
    if (materiasPerido.length>0)
    {
        var wsCalif=materiasPerido[0][7];
        var wsURL=materiasPerido[0][11];
        var wsIndex=materiasPerido[0][0];
        var wscorreo=materiasPerido[0][1];
        
        datuaTabla.push(wsIkasle,nomAsig,wsciclo,wsParcial,wsCalif,wsURL,wsIndex,wscorreo,wsAsignaCve)
        
    }
    else
    {
        console.log("materias Periodo vacio "+"ikasleCorreo:"+ikasleCorreo+" wsciclo:"+wsciclo+" wsParcial:"+wsParcial+" wsAsignaCve:"+wsAsignaCve)
    }
    return datuaTabla
}

function obtieneDatosLista(wsIkasle,wsURL)
{
    //Obtiene datos a mostrar en la ventana
    var datosLista=[];
    var windex=wsURL.lastIndexOf("/");
    var wurl=wsURL.substr(0,windex)
    var wurlX=wurl.lastIndexOf("/")+1;
    var wId=wurl.substr(wurlX,60);
    console.log(wId);
    var wLista=SpreadsheetApp.openById(wId);
    var wListaOrria=wLista.getSheetByName('ORIGEN');
    var wListaDatua=wListaOrria.getDataRange().getDisplayValues();
    var wnomAsigLsta=wLista.getRange("B6").getDisplayValue();
    var wperioLsta=wLista.getRange("BA3").getDisplayValue();
    var wparcialLsta=wLista.getRange("AH1").getDisplayValue();
    var wListaDatuaF=wListaDatua.filter(ilara=>ilara[2]==wsIkasle);
    if (wListaDatuaF.length>0)
    {
        var wnombre=wListaDatuaF[0][2];
        var wcalifLista=wListaDatuaF[0][82];
    }
    datosLista.push(wnombre,wnomAsigLsta,wperioLsta,wparcialLsta,wcalifLista)
    return datosLista;
    

            //obtener posicion en la tabla y url de lista

            //acceder a la lista y obtener datos necesarios con filtro por nombre solo del area de calificaciones
            //calificacion
}

function actualizaCalif(wsIndex,wscorreo,wsciclo,wsAsignaCve,wsparcialTab,califLista)
        //Actualiza la tabla de calificaciones buscando el alumno solicitado y modificando la calificacion
        // utiliza el indice de la BD y la calificacion. Para estar seguro valida la materia, el correo, 
        //parcial y ciclo
{
//selecciona la linea dentro de la tabla de calificaciones con el wsIndex
var wlineaTab=tablaCalDatuak.filter(ilara=>ilara[0]==wsIndex)
if (wlineaTab.length>0)
{
    if(wlineaTab[0][1]==wscorreo && wlineaTab[0][6]==wsAsignaCve && wlineaTab[0][4]==wsciclo && wlineaTab[0][5]==wsparcialTab)
    {
        wserror=0;
        tablaCalifOrria.getRange(wsIndex,8,1,1).setValue(califLista);
    }
    else
    {
        console.log("wlineaTab[0][1]"+wlineaTab[0][1])
        console.log("wscorreo"+wscorreo)
        console.log("wlineaTab[0][6]"+wlineaTab[0][6])
        console.log("wsAsignaCve"+wsAsignaCve)
        console.log("wlineaTab[0][4]"+wlineaTab[0][4])
        console.log("wsciclo"+wsciclo)
        console.log("wlineaTab[0][5]"+wlineaTab[0][5])
        console.log("wsparcialTab"+wsparcialTab)
        wserror=1;
    }
    

}
else
{
    wserror=1;
}

return wserror
}