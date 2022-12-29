import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Usuario, File } from '../../models/usuario.model';

import {MatTableDataSource} from '@angular/material/table';
import * as XLSX from 'xlsx';








@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  usuarios: any= [];
  usuario?:any;
  displayedColumns: string[] = [ 'id', 'Nombre', 'Empresa'];
  dataSource:any;
  file: any;

  @ViewChild('inputText') myDomElement!: ElementRef;
  @ViewChild('inputTextRead') myDomElementRead!: ElementRef;

  constructor(
    private _products: ProductsService
  ) { }

  ngOnInit(){
    this._products.getAllProducts().subscribe({
      next: (resp) =>{ 
        console.log(resp)
        this.usuarios = resp;
        this.usuario = this.usuarios[0];
        console.log( JSON.stringify( this.usuario))
        this.dataSource = new MatTableDataSource<any>(this.usuarios);
      },
      error: err => {
        console.warn(err)
      }
    })

    this.hola();


  }
  onChangeRead(event:any){

    this.file = event.target.files[0];
    console.log(this.file)
  }
  fileUpload(){
    
    if (this.file === null) {
      alert('Debe de subir un archivo para realizar la accion');
      return;
    }
    console.log('Inicio de consulta de usuarios desde('+this.file.name+').');

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = (event:any) => {
    let binaryData = event.target.result;
   
      
      //inicio XLSX
      let workbook = XLSX.read(binaryData, {type: 'binary'});
      let sheetsNameFile = workbook.SheetNames;
      let dataSheet:any = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsNameFile[0]], {header:1});
    
      if (dataSheet[0] != 'ID') {
        alert('La columna sebe escribirse como "NroSerie"');
        return;    
      }
      let idUsuarios= []; 
      for (let i = 1; i < dataSheet.length; i++) { 
        if(dataSheet[i][0]){
          console.log(dataSheet[i][0])
          idUsuarios.push(dataSheet[i][0]);
        }
      }
      console.log({idUsuarios})

    

      
    }
    
  }


  //La funcion hola obtiene un array de id, y con eso hago un bucle de consultas GET al endpoint
   juan: Array<any> = [];
  hola(arr = [3,5]){
    
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      this._products.getUser(element).subscribe({
        next: (resp) =>{ 
          console.log(resp)
          this.juan.push(resp)
        },
        error: err => {
          console.warn(err)
        },
        complete: ()=> {console.log(this.juan)}
      })
      
    }
  }

}
