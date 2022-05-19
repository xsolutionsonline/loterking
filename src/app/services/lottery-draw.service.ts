import { Injectable } from '@angular/core';
import { LotteryDraw } from '../models/lottery-draw';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { PlayerLottery } from '../models/playerLottery';

@Injectable({
  providedIn: 'root',
})
export class LotteryDrawService {
  constructor(private afs: AngularFirestore) {}

  getLotteryDrawById(id: string) {
    return this.afs
      .collection<LotteryDraw>('lotteryDraw', (ref) =>
        ref.where('id', '==', id).orderBy('order','asc')
      )
      .snapshotChanges()
      .pipe(
        map((lottery) => {
          return lottery.map((a) => {
            const data = a.payload.doc.data() as LotteryDraw;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            if (data.date) {
              const timeDate: any = data.date;
              data.date = new Date(timeDate.seconds * 1000);
              const timeDateEnd: any = data.dateEnd;
              data.dateEnd = new Date(timeDateEnd.seconds * 1000);
            }

            return { id, ...data };
          });
        })
      );
  }

  async updateLottery(lottery: LotteryDraw) {
    await this.afs
      .collection('lotteryDraw')
      .doc(lottery.id)
      .set({
        ...lottery,
      })
      .catch((err) => console.log('errr 001', err));
  }

  async createLottery(lottery: LotteryDraw) {
    await this.afs
      .collection('lotteryDraw')
      .add({
        ...lottery,
      })
      .catch((err) => console.log('errr 001', err));
  }

  async createHistoryLottery(lottery: LotteryDraw) {
    lottery.id=null;
    await this.afs
      .collection('lotteryHistoryDraw')
      .add({
        ...lottery,
      })
      .catch((err) => console.log('errr 001', err));
  }

  async createPLayerLottery(playerLotery: PlayerLottery) {
    await this.afs
      .collection('playerLotery')
      .add({
        ...playerLotery,
      })
      .catch((err) => console.log('errr 001', err));
  }

  async updatePLayerLottery(playerLotery: PlayerLottery) {
    await this.afs
      .collection('playerLotery')
      .doc(playerLotery.id)
      .set({
        ...playerLotery,
      })
      .catch((err) => console.log('errr 001', err));
  }

  getPlayerLottery() {
    return this.afs
      .collection<PlayerLottery>('playerLotery', (ref) =>
        ref.where('points', '>=', 0).orderBy('points','asc')
      )
      .snapshotChanges()
      .pipe(
        map((player) => {
          return player.map((a) => {
            const data = a.payload.doc.data() as PlayerLottery;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
}
