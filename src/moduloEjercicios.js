import basededatos from './basededatos.js';


/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    
    let promedioPeliculas = 0;
    let acomularAnios = basededatos.peliculas.reduce((sumaTotal, valorActual)=>sumaTotal + valorActual.anio, 0);

    promedioPeliculas = Math.floor(acomularAnios/basededatos.peliculas.length)

    return promedioPeliculas;
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {

    let arrayPeliculas = []

    basededatos.peliculas.forEach((pelicula)=>{
        let infoPelicula = {idPelicula: pelicula.id, sumaPuntuacion: 0, contador: 0}
        basededatos.calificaciones.forEach((calificacion)=>{
            if(pelicula.id === calificacion.pelicula){
                infoPelicula.sumaPuntuacion +=calificacion.puntuacion
                infoPelicula.contador ++;
            }
        })
        const promedioPelicula = Math.floor(infoPelicula.sumaPuntuacion/infoPelicula.contador);
        if(promedioPelicula > promedio){
            arrayPeliculas.push(pelicula)
        }
    })

    return arrayPeliculas;
};

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    
    let director = basededatos.directores.find((direc)=>{
        if(direc.nombre === nombreDirector){
            return direc
        }
    })

    let listaPeliculasDirector = basededatos.peliculas.filter((pelicula)=>{
        if(pelicula.directores.includes(director.id)){
            return pelicula;
        }
    })
    
    return listaPeliculasDirector;
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
    
    let sumTotalCritica = 0;
    let promedioCritica = 0;

    let filtroCalificaciones = basededatos.calificaciones.filter((calificacion)=>{
        if(calificacion.pelicula === peliculaId){
            return calificacion;
        }
    })

    sumTotalCritica = filtroCalificaciones.reduce((sumaTotal, valorActual)=> sumaTotal + valorActual.puntuacion, 0);
    promedioCritica = Math.floor(sumTotalCritica/filtroCalificaciones.length);

    return promedioCritica;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
    
    let arrayPuntuaciones = [];

    basededatos.calificaciones.forEach((calificacion)=>{
        if(calificacion.puntuacion >=9){
            arrayPuntuaciones.push(calificacion.pelicula)
        }
    })

    let peliculasExcelentes = []

    basededatos.peliculas.forEach((pelicula)=>{
        if(arrayPuntuaciones.includes(pelicula.id)){
            peliculasExcelentes.push(pelicula)
        }
    })
    
    return peliculasExcelentes
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
    
    let directores = [];
    let generos = [];
    let criticas = [];
    
    let peliculaFilter = basededatos.peliculas.filter((pelicula)=>{
        if(pelicula.nombre === nombrePelicula){
            return pelicula
        }
    });

    basededatos.directores.forEach((director)=>{
        if(peliculaFilter[0].directores.includes(director.id)){
            directores.push(director);
        }
    });

    basededatos.generos.forEach((genero)=>{
        if(peliculaFilter[0].generos.includes(genero.id)){
            generos.push(genero);
        }
    })

    basededatos.calificaciones.forEach((calificacionCritico)=>{
        let objetoCritico = {};
        if(calificacionCritico.pelicula === peliculaFilter[0].id){
            objetoCritico.puntuacion = calificacionCritico.puntuacion;
           basededatos.criticos.forEach((critico)=>{
               if(critico.id === calificacionCritico.critico){
                   basededatos.paises.forEach((pais)=>{
                       if(pais.id === critico.pais){
                            objetoCritico.critico = {
                                ...critico,
                                pais: pais.nombre
                            }
                       }
                   })
               }
           })
           criticas.push(objetoCritico);
        }  
    })

    peliculaFilter = {
        ...peliculaFilter[0],
        directores: directores,
        generos: generos,
        criticas: criticas
    }

    return peliculaFilter
};
