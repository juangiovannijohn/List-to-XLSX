import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Usuario, File } from '../../models/usuario.model';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FileSaverService  } from 'ngx-filesaver';







@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  usuarios:Array< Usuario>= [];
  usuario?:any;
  displayedColumns: string[] = [ 'id', 'Nombre', 'Empresa'];
  dataSource:any;
  file: any;
  juan:Array<any> =[];

  @ViewChild('inputText') myDomElement!: ElementRef;
  @ViewChild('inputTextRead') myDomElementRead!: ElementRef;

  constructor(
    private _products: ProductsService,
    private _fileService : FileSaverService
  ) { }

  ngOnInit(){
    this._products.getAllProducts().subscribe({
      next: (resp: any) =>{ 
        //console.log(resp)
        this.usuarios = resp;
        this.usuario = this.usuarios[0];
      },
      error: err => {
        console.warn(err)
      }
    })



  }
  onChangeRead(event:any){

    this.file = event.target.files[0];
    console.log(this.file)

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
          idUsuarios.push(dataSheet[i][0]);
        }
      }

      
      //console.log(typeof idUsuarios)
      this.hola(idUsuarios);
    }
  }
  fileUpload(){
    console.log(this.file)
    if (this.file === undefined) {

    }
      //DESCARGA EXCEL
      console.log('Data',this.juan.length)
      if (this.juan.length > 0) {
        //Se crea el nuevo excel
        const wscols = [
          {wch: 5},
          {wch: 20},
          {wch: 20},
          {wch: 15},
          {wch: 15},
          {wch: 20},
          {wch: 20},
          {wch: 20},
          {wch: 15},
        ]
        const worksheet = XLSX.utils.json_to_sheet(this.juan);
        worksheet['!cols'] = wscols;
        const workbookNew = 
        {
          Sheets: {
            'prueba': worksheet
          },
          SheetNames: ['prueba']
        }
        
        const excelBuffer = XLSX.write(workbookNew, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        this._fileService.save(blob, "Consulta.xlsx");
      }
       //DESCARGA EXCEL--------
 
    }
    
  


  //La funcion hola obtiene un array de id, y con eso hago un bucle de consultas GET al endpoint
  hola(arr:Array<any>){
    
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      this._products.getUser(element).subscribe({
        next: (resp) =>{ 
          //console.log('respuesta de serivicio busqueda de usuario individual',resp)
          const { address, company} = resp

          let objeto = {
            ID: resp.id,
            NOMBRE: resp.name,
            EMPRESA: company.name,
            USUARIO: resp.username,
            PORTFOLIO: resp.website,
            EMAIL: resp.email,
            TELEFONO: resp.phone,
            DIRECCION: address.street,
            CIUDAD: address.city,
          }
          this.juan.push(objeto)
        },
        error: err => {
          console.warn(err)
        },
        complete: ()=> {}
      })
      
    }
    
  }

}
