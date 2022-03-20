import { Injectable } from '@angular/core';
import { LotteryDraw } from '../models/lottery-draw';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LotteryDrawService {

  constructor(private afs: AngularFirestore) {}

  getLotteryDrawById(id: string) {
    return this.afs
      .collection<LotteryDraw>('lotteryDraw', (ref) =>
        ref
          .where('id', '==', id)
      )
      .snapshotChanges()
      .pipe(
        map((lottery) => {
          return lottery.map((a) => {
            
            const data = a.payload.doc.data() as LotteryDraw;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            if(data.date){

              const timeDate: any= data.date;
              data.date = new Date(timeDate.seconds * 1000);
              const timeDateEnd: any= data.dateEnd;
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
}
