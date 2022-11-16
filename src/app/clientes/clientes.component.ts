import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

import { tap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';

// importamos al modal service
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

clientes: Cliente[] = [];
paginador: any;
clienteSeleccionado:Cliente;


  constructor(private clientesService: ClienteService,
    private ModalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // este es para sin oservable
    // this.clientes = this.clientesService.getClientes();

    // definimos el numeor de para
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');

      if(!page){
        page=0
      }

      // este es para observable reactivo
      this.clientesService.getClientes(page)
      .pipe(
        tap(response => {

          // esto igual se peude hacer dentro de ltap
          // this.clientes = clientes

          console.log("****** ESTE ES EN COPONET ******");

          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente)
          })
        })
      )
      .subscribe(
        // esta funcion hace que se actualice
        (response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    });

    // para que el listado se actualice
    this.ModalService.notificarUpload.subscribe(
      cliente => {
        this.clientes = this.clientes.map(
          clienteOriginal =>{
            // buscamos si el id es el mismo al id que cambiamos
            if(cliente.id == clienteOriginal.id){
              // econtramos y le pasamos y devilvemos el cliente original con la ueva foto
              clienteOriginal.foto = cliente.foto;
            }
            return clienteOriginal
          })
      }
    );

  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Esta seguro de eliminar al cliente'+cliente.nombre+'?',
      text: "No podra revertir la accion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // ahora vamos a actulizar la lista de los clientes
        this.clientes = this.clientes.filter(cli  => cli !== cliente)

        // hacemos la elimiwnacion
        this.clientesService.delete(cliente.id).subscribe(
          resolver => {
            Swal.fire({
              title: 'Eliminado!',
              text: 'Se elimino con exito',
              icon: 'success',
              timer: 1000
            })
          }
        );
      }
    })
  }

abriModal(cliente: Cliente){

  console.log(cliente)

  this.clienteSeleccionado = cliente;
  this.ModalService.abrirModal();

}

}
