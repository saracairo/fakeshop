import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Cart, CartItem } from '../models/Cart';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =  new BehaviorSubject<Cart>({ items: [] });
    // BehaviorSubject memorizza un valore iniziale e ogni volta che l'utente aggiunge un item al carrello, aggiorna il valore di questo array (items)
    // è possibile da ogni componente dell'app fare subscribe a questo BehaviorSubject e ricevere i nuovi valori per aggiornare la UI

  constructor(private _snackBar: MatSnackBar)
    // la snackbar mostra informazioni all'utente
    { }

  addToCart(item: CartItem): void {
    // creazione di un nuovo array items per non compromettere l'oggetto cart originale:
    const items = [...this.cart.value.items];

    // creazione di una proprietà che indica l'oggetto già presente nel carrello
    const itemInCart = items.find((_item) => _item.id === item.id);

    // se il metodo trova l'item aggiunto già nel carrello...
    if (itemInCart) {
      // ...incrementa la quantità senza aggiungere un nuovo oggetto nell'array...
      itemInCart.quantity += 1;
    } else {
      // altrimenti aggiungilo all'array:
      items.push(item);
    }

    // tutti i componenti iscritti al carrello possono accedere al valore del risultato:
    this.cart.next({ items });

    // apertura snackbar che informa l'utente dell'avvenuta operazione:
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 }); // il secondo argomento viene assegnato a un bottone, il terzo definisce la durata di apertura della finestra;

    console.log(this.cart.value);
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map(
      (_item) => {
        // se l'id item corrisponde a questo id item...
        if(_item.id === item.id) {
          // ...rimuovi la quantità:
          _item.quantity--;

          // se dopo l'operazione la quantità raggiunge lo 0, rimuovere completamente l'oggetto dal carrello:
          if(_item.quantity === 0) {
            itemForRemoval = _item;
          }
        }
        return _item;
      }
    );

    // se ci sono oggetti da rimuovere in itemForRemoval, chiama il metodo removeFromCart():
    if(itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from the cart.', 'Ok', {
      duration: 3000
    });
  }

  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
      // selezione dei prezzi item e moltiplicazione per la quantità
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000
    });
  }

  // Metodo che accetta un oggetto con interfaccia CartItem e lo rimuove dal carrello:
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      // prende l'_item dentro al loop e fltra tutti gli altri item che non corrispondono al suo id:
      (_item) => _item.id !== item.id
    );

    if(update) {
      // update filteredItems:
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000
      });
    }

    return filteredItems;

  }
}
