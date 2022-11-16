import { Injectable } from '@angular/core';

// formato de fecha
import { formatDate } from '@angular/common';

/**
 * eSTO SOLO SE UTILIZA PARA LA SIMULACION DE UNA BASE DE DATOS
 * */
// import { CLIENTES } from './clientes.json';

import { Cliente } from './cliente';
import { Region } from './region';
import { of, Observable, throwError } from 'rxjs';
import  Swal  from 'sweetalert2';

/*Para las las request y connecion de la base da datos*/
//primera forma
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';

//otra forma
import { map , catchError, tap} from 'rxjs/operators';

// impotarmos las routas
import { Router } from '@angular/router';

@Injectable(
  {
  providedIn: 'root'
}
)

export class ClienteService {

  // la url de donde saldran los datos
  private urlEndPoint:string = "http://localhost:9999/api/clientes";

  /*Jalamos a los headres de http */
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  // aqui pones la inyeccion con la api
  constructor(private http: HttpClient,
              private router: Router
            ) { }

  // para sacar todas los regiones para los regiones
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  // COMVERTIMOS EN OBSERVABLES "REACTIVO"
  getClientes(page: number): Observable <any>{
    // return of (CLIENTES);

    // primera forma
    // return this.http.get<Cliente[]>(this.urlEndPoint);

    // segna forma
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap( (response: any) => {

        console.log("*** ANTES DEL CAMBIO ****");

        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre)
        })
      }),
      map( (response: any) => {

        // esta funcion retorna los nombre en mayuscula
        (response.content as Cliente[]).map(cliente=>{
          cliente.nombre    = cliente.nombre.toUpperCase();
          // cliente.apellido  = cliente.apellido.toUpperCase();
          // cliente.email = cliente.email.toUpperCase();

          // formato d fecha
          // cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
          return cliente;
        });

        return response;

      }),
      tap(response => {
        console.log("*** DESPUES DEL CAMBIO ****");
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      }),
    );

  }

  /*
  implememtamos el crear cliente
  */
  create(cliente : Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        // esto es para que devuelva el error del servidor
        if(e.status == 400){
          return throwError(e);
        }

        // console.log(e.error.mensaje);

        //este es para el anejo de errose del agular
        Swal.fire({
          title: 'Error al crear el cliente!',
          text: e.error.mensaje,
          icon: 'error'
        })

        return throwError(e);

      })
    );
  }

  /*
  funcion para editar al clientes
  */
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError(e => {

        this.router.navigate(['/clientes']);

        Swal.fire({
          title: 'Error!',
          text: e.error.mensaje,
          icon: 'error'
        })

        return throwError(e);
      })
    );
    // return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
  }

 /*
 esta funcion actualiza el cliente
 */
  upDate(cliente: Cliente): Observable<any>{
    return this.http.put<any>(this.urlEndPoint+'/'+cliente.id,
                          cliente,
                          {headers: this.httpHeaders}).pipe(
                            catchError(e => {

                              // esto es para que devuelva el error del servidor
                              if(e.status == 400){
                                return throwError(e);
                              }

                              Swal.fire({
                                title: e.error.mensaje,
                                text: e.error.error,
                                icon: 'error'
                              })
                              return  throwError(e);
                            })
                          );
    // return this.http.put(`${this.urlEndPoint}/${cliente.id}`);
  }

  /**
   * esta funcion elimina un cliente
   */
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(this.urlEndPoint+'/'+id,
                                {headers: this.httpHeaders}).pipe(
                                  catchError(e => {
                                    Swal.fire({
                                      title: e.error.mensaje,
                                      text: e.error.error,
                                      icon: 'error'
                                    })
                                    return  throwError(e);
                                  })
                                );
  }

  /**
   * PARA SUBIR IMAGENES AL FORMULARIO
   */
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

    let formData = new FormData();

    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', this.urlEndPoint+'/upload', formData, {
      reportProgress: true
    });

    return this.http.request(req);

  }

}
