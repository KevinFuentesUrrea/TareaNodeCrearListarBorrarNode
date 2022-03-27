require('colors');
const Tareas = require('./models/tareas');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');

const main = async() => 
{

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    // Aqui se cargan las tareas
    if ( tareasDB ) 
    { 
        tareas.cargarTareasFromArray( tareasDB );
    }

    do 
    {
        // Imprimir el menú
        opt = await inquirerMenu();

        switch (opt) 
        {
            case '1':
                // crear opciones
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            break;
            
            case '3': // lista las  completadas
                tareas.listarPendientesCompletadas(true);
            break;

            case '4': // lista las pendientes
                tareas.listarPendientesCompletadas(false);
            break;

            case '5': // muesta las tareas completadas o las pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;
                       
            case '6': // Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) 
                {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) 
                    {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break;        
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while( opt !== '0' );
}


main();

