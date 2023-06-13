import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cart } from 'src/app/models/Cart';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

// Creazione oggetto da usare per mappare rowHeight; la variabile sarà di tipo oggetto che conterrà un id di tipo number, e il corrispettivo valore numerico:
const ROWS_HEIGHT: { [id: number]: number } = {
  1: 400,
  3: 350,
  4: 350
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() columnsCountChange = new EventEmitter<number>();
    // proprietà che emette dati fuori dal componente, rendendoli accessibili al parent (tramite decoratore @Output), emettendo un evento di tipo numero che verà raccolto da home component per aggiornare una sua proprietà
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  productList: Array<Product> | undefined;
  category: string | undefined;
  cols= 3; // numero di items per row (default 3)
  rowHeight = ROWS_HEIGHT[this.cols]; // variabile che dipende da cols
  sort = 'lowest'; // proprietà aggiornata dal metodo onSortUpdated
  count = '12';
  itemsShowCount = 12;
  cart: Cart = { items: [] };

  // dependency injection
  constructor (
    private storeService: StoreService,
    private cartService: CartService
  ) { }

  // la chiamata API va fatta nella funzione OnInit, il primo lifecycle event del componente - il costruttore serve per l'inizializzazione del componente -
  ngOnInit(): void {
    // subscribe alla proprietà cart del servizio CartService (che sarà passato al template app-header)
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });

    // debugger; ???

    this.loadAllProducts();
  }

  loadAllProducts() {
    this.storeService.getAllProducts().subscribe(
      (response: Product[]) => {
        this.productList = response;
        console.log(response);
      }
    );
  }

  // L'API call response ritorna un oggetto, dentro il quale abbiamo una propietà data, in cui si trova l'array

  /* =============================================
               Filter Methods
  ============================================= */

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.loadAllProducts();
  }

  onSortUpdated(newSort: string): void {
    this.sort = newSort;
    this.sortChange.emit(newSort);
  } // metodo che ha il compito di aggiornare la variabile sort (e non ritorna niente), ovvero l'ordine di visualizzazione dei prodotti

  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  } // metodo che aggiorna il tipo di layout della griglia (numero di colonne - prodotti - mostrate in una riga), ovvero la variabile; emette il numero che riceve dal template nella variabile columnsCountChange

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  } // metodo che raccoglie i dati che provengono dal componente child (accettando un parametro colsNum di tipo number) e aggiorna la sua proprietà cols; aggiorna inoltre la variabile rowHeight al cambio


  /* =============================================
               Service Cart Methods
  ============================================= */

  onAddToCart(product: Product): void {
    // accetta un parametro product con l'interfaccia Product

    this.cartService.addToCart({
      // al metodo addToCart del servizio viene passato questo oggetto;
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    });
  }

}
