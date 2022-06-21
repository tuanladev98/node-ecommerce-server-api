import { Gender } from '../enums';

export type TProductItem = {
  id: number;
  code: string;
  productName: string;
  description: string;
  price: number;
  gender: Gender;
  image01: string;
  image02: string;
  categoryId: number;
};
