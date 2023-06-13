import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  // NOTA: nella dichiarazione variabili, è utile specificare "| undefined" quando i dati vengono passati da API perché per un certo lasso di tempo potrebbero risultare indefiniti nella lettura della variabile.


  // METODO che emette il prodotto preso dall'input: quando l'utente clicca sul bottone "Add to cart" di un prodotto, il metodo lo invia al carrello:
  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
