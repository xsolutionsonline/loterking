import { Customer } from './customer';
import { PlayerLottery } from './playerLottery';
export interface LotteryDraw {
    id?:string;
    acumulate:number;
    order:number;
    price:number;
    profit:number;
    winningPot:number;
    percentajeWin:number;
    date:Date;
    dateAdd:number;
    title:string;
    dateEnd:any;
    players?:PlayerLottery[];
    positions:number;
    winner:Customer;
    lastTime:string;

}
