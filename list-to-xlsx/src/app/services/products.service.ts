import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model'


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http:HttpClient
  ) { }


   //'https://api.escuelajs.co/api/v1/products'
   //
  getAllProducts(){
    const url = 'https://jsonplaceholder.typicode.com/users';
    return this.http.get<Usuario>(url);
  }
  getUser(id:number){
    const url = `https://jsonplaceholder.typicode.com/users/${id}`;
    return this.http.get<Usuario>(url);
  }

}
