import { Customer } from './customer';
export interface LotteryDraw {
    id?:string;
    acumulate:number;
    price:number;
    profit:number;
    winningPot:number;
    percentajeWin:number;
    date:Date;
    dateEnd:Date;
    players?:Customer[];
    positions:number;
    winner:Customer;
    lastTime:string;

}
