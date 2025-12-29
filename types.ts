export enum Tone {
  Smart = 'Smart',
  Professional = 'Professional',
  Empathetic = 'Empathetic',
  Witty = 'Witty',
  Apologetic = 'Apologetic',
}

export interface ReviewData {
  hotelName: string;
  tone: Tone;
  context: string;
  reviewText: string;
}

export interface SelectionData {
  text: string;
  top: number;
  left: number;
}