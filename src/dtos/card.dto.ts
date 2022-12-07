import { CardType } from 'src/models';

export interface CardResponse {
  id: string;
  type: CardType;
  title?: string;
  body: string;
  quickPlay: boolean;
}
