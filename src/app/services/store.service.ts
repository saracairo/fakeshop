import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

const STORE_BASE_URL = 'http://fakestoreapi.com';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }

  getAllProducts(category?: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${STORE_BASE_URL}/products
        ${category ? '/category/' + category : ''}`
      // dopo '/products', se al metodo è stata passata una categoria, aggiungere '/categories/' + il nome categoria, altrimenti (:) ritornare stringa vuota;
    );
  }

  getAllCategories(): Observable<String[]> {
    return this.http.get<String[]>(
      `${STORE_BASE_URL}/products/categories`
    );
  }
}
