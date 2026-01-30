export interface Gallery {
  _id: string;
  url: string;
  category: string;
  caption?: string;
  destination?: string;
  order: number;
  createdAt: string;
}
