import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

// importamos al modal service
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {


  @Input() cliente: Cliente;

  public titulo:string = "Detalle del cliente"
  public fotoSeleccionada: File;
  // private fotoSeleccionada: File;
  public progreso:number = 0;

  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService) { }

  ngOnInit(): void {

    // ya no va por ue ya se inyecto en un modal
    // this.activatedRoute.paramMap.subscribe(
    //   params=>{
    //     let id:number = +params.get('id');
    //     if(id){
    //       this.clienteService.getCliente(id).subscribe(
    //         cliente=>{
    //           this.cliente = cliente;
    //         }
    //       );
    //     }
    //   }
    // );

  }

  /**
   * Esta funcion hace para subir la foto
   */
  seleccionarFoto(event){

    this.fotoSeleccionada = event.target.files[0];
    // inicializamos en 0 para que vuelva a verse el progreso
    this.progreso = 0;

    console.log(this.fotoSeleccionada);
    // console.log(this.fotoSeleccionada.type.indexOf('image'));
    if(this.fotoSeleccionada.type.indexOf('image')<0){
      Swal.fire({
        title: "Error!",
        text: "Debe seleccionar un archivo de tipo imagen",
        icon: 'error'
      })

      this.fotoSeleccionada = null;
    }else{

    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire({
        title: "Error!",
        text: "Debe seleccionar una imagen ",
        icon: 'error'
      })
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        cliente =>{

          if(cliente.type ===  HttpEventType.UploadProgress){
            this.progreso = Math.round((cliente.loaded / cliente.total)*100);
          }else if(cliente.type === HttpEventType.Response){
            let response:any = cliente.body;
            this.cliente = response.cliente as Cliente;
            // this.cliente = cliente;

            this.modalService.notificarUpload.emit(this.cliente);

            Swal.fire({
              title: "Excelente!",
              text: response.mensaje,
              // text: "La foto se subio completamente "+this.cliente.foto,
              icon: 'success'
            })
          }


        }
      );
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
