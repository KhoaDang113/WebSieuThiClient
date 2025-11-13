export interface Banner {
  id?: string | number;
  _id?: string; // MongoDB _id
  name?: string;
  image_url: string;
  image?: string; // Backend field
  link_url: string;
  link?: string; // Backend field
  category_id?: string;
}
