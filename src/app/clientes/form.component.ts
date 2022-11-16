import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
//|ActivatedRoute => para recibir varilbes de la url
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})

export class FormComponent implements OnInit {

  public regiones: Region[];
  public cliente: Cliente = new Cliente()
  public titulo:string = "Formulario de cliente"

  // lista de errores
  public errores: string[];

  // inectamos los impordos
  constructor(
    private clienteSerice: ClienteService,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) { }

  /*
  esta funcion se ejecuta cuando se inialaiza el componnete
  */
  ngOnInit(): void {
    this.cargarCliente()
  }

  public cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteSerice.getCliente(id).subscribe(
          (cliente) => {
            this.cliente = cliente
          }
        )
      }
    });

    this.clienteSerice.getRegiones().subscribe(
      regiones => {
        this.regiones = regiones;
      }
    );
  }

  public create(): void{
    // console.log("esta queridno crear!!");
    // console.log("**********************");
    // /**en esta varaibel se jala los clientes del dato */
    // console.log(this.cliente.nombre);
    // // llammamos a create de clientes servie

    console.log("********* DE AQUI ES EL CREAR ***********")
    console.log(this.cliente);

    //esto ahcemos por que desde el controlao de de java no me quiere aeptar
    this.cliente.id = null;

    this.clienteSerice.create(this.cliente).subscribe(
      jsonCliente => {
        this.router.navigate(['/clientes'])

        Swal.fire(
          'Excelente!',
          'Cliente '+jsonCliente.cliente.nombre+' agregado con exito!',
          'success'
        )

      },
      err => {
        console.error(err)
        console.log("--------")
        console.error(err.status)
        console.log("--------")
        console.error(err.error)
        console.log("--------")
        console.error(err.error.errors)

        // para volvero en string de un arreglo
        this.errores = err.error.errors as string[]

      }
    );
  }

  public udDate(): void{

    console.log("********* DE AQUI ES EL EDITAR ***********")
    console.log(this.cliente);

    this.clienteSerice.upDate(this.cliente).subscribe(
      jsonCliente => {
        this.router.navigate(['/clientes'])

        Swal.fire({
          title: 'Excelente!',
          text: 'Cliente '+jsonCliente.cliente.nombre+' editado con exito!',
          icon: 'success',
          timer: 1500
        })

      },
      err => {
        console.error(err)
        console.log("--------")
        console.error(err.status)
        console.log("--------")
        console.error(err.error)
        console.log("--------")
        console.error(err.error.errors)

        // para volvero en string de un arreglo
        this.errores = err.error.errors as string[]

      }
    );
  }

  compararRegion(o1: Region, o2: Region): boolean{

    if(o1 === undefined && o2 === undefined){
      return true;
    }

    return (o1==null || o2==null)? false: (o1.id === o2.id);
  }

}
