import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/Cart';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Il componente viene iscritto a cart, quindi ha accesso al suo valore per poter aggiornare la sua UI;

  // Definizione variabile privata (_ è convenzione delle variabili private) cart di tipo Cart, con valore di default un array vuoto:
  private _cart: Cart = { items: [] };

  // Proprietà che verrà aggiornata in base a _cart:
  itemsQuantity = 0;

  @Input()
  // getter:
  get cart(): Cart {
    return this._cart;
  }
  // setter:
  set cart(cart: Cart) {
    this._cart = cart;

    // ogni volta che cart cambia, aggiornare itemsQuantity:
    this.itemsQuantity = cart.items // prende l'array e...
     .map(
      // (mappare i field dell'item e prendere il valore quantity:)
      (item) => item.quantity // ...ne trasforma il valore in solo quantità...
     )
     .reduce((prev, current) => prev + current, 0);
     // reduce prende come argomenti il valore di cart.items e item.quantity e li somma
  }

  constructor(private cartService: CartService) {}

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart() {
    this.cartService.clearCart();
  }
}
