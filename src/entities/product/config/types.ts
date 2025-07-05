export interface IProduct {
  id: string;
  images: string[];
  price: number;
  title: string;
  shortTitle: string;
  sizes: ("S" | "M" | "L" | "XL" | "XXL")[];
  features: string[];
  composition: string[];
}
