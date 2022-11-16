import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// importamos la clase que creamos
import { headercomponet } from './header/header.componet';

// importamos la clase que creamos FOOTER COMPONET
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';

// importamos el clienteServece
import { ClienteService } from './clientes/cliente.service';

// importamos para las rutas
import { RouterModule, Routes } from '@angular/router';

// importamos las clases para los navegadores para la comuncacion con el servidor (GET POST DELETE PUT)
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './clientes/form.component';

// para la paginacion
import { PaginatorComponent } from './paginator/paginator.component';

import { FormsModule } from '@angular/forms';

// formato de fecha
import {registerLocaleData } from '@angular/common';
// importacion de leguaje de fecha es para fecha
import localeEs from '@angular/common/locales/es-BO';

// esta funcion es para el lenguaje de español
registerLocaleData(localeEs, 'es')

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DetalleComponent } from './clientes/detalle/detalle.component';

const routes: Routes = [
  { path: '',redirectTo: '/clientes', pathMatch: 'full'},
  { path: 'directiva', component:DirectivaComponent},
  { path: 'clientes', component:ClientesComponent},
  { path: 'clientes/form', component:FormComponent},
  { path: 'clientes/form/:id', component:FormComponent},
  { path: 'clientes/page/:page', component:ClientesComponent},
  // Eliminamos por que  ya no srive ahora es modal
  // { path: 'clientes/verFoto/:id', component:DetalleComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    headercomponet,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    // ClienteService
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,//para trabajar con formularios
    RouterModule.forRoot(routes),
    // MatDatepickerModule,
    // MatNativeDateModule,
    BrowserAnimationsModule
],
  providers: [
    ClienteService,
    {provide: LOCALE_ID, useValue:'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
