// Un'interfaccia forza la struttura dell'oggetto che viene poi consumato dal componente che lo riceve.

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}
