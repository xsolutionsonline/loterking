import { Component, OnInit } from '@angular/core';
import { LotteryDraw } from '../../models/lottery-draw';
import { LotteryDrawService } from '../../services/lottery-draw.service';
import { CustomerService } from '../../services/customer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  timeBegan: any = new Date();
  started: any = null;
  winner: string = 'AAAAAA';
  minuteInput: number = 0;
  secondsInput: number = 0;

  hourOutput: string = '';
  minuteOutput: string = '';
  secondsOutput: string = '';
  miliSecondsOutput: string = '';
  lottery: LotteryDraw;
  customer: Customer;
  player: Customer;
  playersView: Customer[];
  startGame: boolean;
  finishedGame: boolean;

  constructor(
    private lotteryDrawService: LotteryDrawService,
    private customerService: CustomerService,
    private Oauth: AngularFireAuth,
    public alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.Oauth.authState.subscribe((user: any) => {
      if (user) {
        this.customerService.getCustomerData(user.uid).subscribe((data) => {
          this.customer = data[0];

          this.lotteryDrawService
            .getLotteryDrawById('JfWIRLA0R1qKqGnLJOxG')
            .subscribe((data) => {
              this.lottery = data[0];
              this.beginGame();
            });
          this.started = setInterval(() => {
            if (this.lottery && this.startGame) {
              this.clockRunning();
            }
          }, 10);
        });
      }
    });
  }

  async presentAlertConfirm() {
    if (!this.finishedGame) {
      this.finishedGame = true;
      const winner = this.lottery.players.find(
        (data) => data.uid === this.winner
      );
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'el juego HA FINALIZADO',
        message: `EL GANADOR ES <strong>${winner?.userName}</strong>?`,
        buttons: [
          {
            text: 'Salir',
            role: 'cancel',
            cssClass: 'primary',
            id: 'cancel-button',
            handler: (blah) => {
              this.lottery.players=null;
              this.lotteryDrawService.updateLottery(this.lottery);
              this.router.navigate(['/home']);
            },
          },
        ],
      });

      await alert.present();
    }
  }

  beginGame() {
    this.player = this.lottery.players?.find(
      (data) => data.uid === this.customer.uid
    );

    if (!this.playersView) {
      this.playersView = this.lottery.players;

      let minutes = 0;
      let seconds = 0;
      minutes = this.lottery.dateEnd.getMinutes() - new Date().getMinutes();
      seconds = 60 - new Date().getSeconds();

      this.minuteInput = minutes;
      this.secondsInput = seconds;
      this.timeBegan = new Date();

      this.timeBegan.setMinutes(this.timeBegan.getMinutes() + this.minuteInput);
      this.timeBegan.setSeconds(
        this.timeBegan.getSeconds() + this.secondsInput
      );
      this.startGame = true;
    } else {
      this.updatePlayers();
    }
  }

  createdRobots() {
    if (this.lottery.players.length < 1000) {
      let robot: Customer;
      while (this.lottery.players.length < 1000) {
        let positions = this.validatePosition();
        robot = {
          status: true,
          accountBalance: 0,
          userName: 'Player' + (this.lottery.players.length + 1),
          position: positions,
          positionOne:
            positions.split('')[0] + this.customer.position.split('')[1],
          positionTwo:
            positions.split('')[2] + this.customer.position.split('')[3],
          verificado: false,
          lastCron: '05:00:000',
          points: 0,
          uid: 'player' + this.lottery.players.length + 1,
        };
        this.lottery.positions = this.lottery.positions + 1;
        this.lottery.players.push(robot);
      }

      this.lotteryDrawService.updateLottery(this.lottery);
    }
  }

  validatePosition(): string {
    if (this.lottery.positions < 10) {
      return '000' + this.lottery.positions;
    } else if (this.lottery.positions < 100) {
      return '00' + this.lottery.positions;
    } else if (this.lottery.positions < 1000) {
      return '0' + this.lottery.positions;
    }
    return '' + this.lottery.positions;
  }

  updatePlayers() {
    if(this.lottery.players){
    this.lottery.players.forEach((data) => {
      const index = this.playersView.findIndex(
        (odata) => odata.uid === data.uid
      );
      if (index >= 0) {
        this.playersView[index].points = data.points;
        this.playersView[index].lastCron = data.lastCron;
      }
    });

    this.playersView.sort(function (a, b) {
      const codeA = a.points;
      const codeB = b.points;

      if (codeA < codeB) {
        return 1;
      }
      if (codeA > codeB) {
        return -1;
      }

      return 0;
    });

    this.winner = this.playersView[0].uid;
    }
  }

  updatePlayer(playerU: Customer) {
    const index = this.playersView.findIndex(
      (data) => data.uid === playerU.uid
    );
    const indexT = this.lottery.players.findIndex(
      (data) => data.uid === this.customer.uid
    );
    if (index >= 0) {
      this.playersView[index] = playerU;
    }
    if (indexT >= 0) {
      this.customer.points = this.player.points + 1;
      this.customer.lastCron =
        this.minuteOutput +
        ':' +
        this.secondsOutput +
        ':' +
        this.miliSecondsOutput;
      this.lottery.players[indexT] = this.customer;
      this.lotteryDrawService.updateLottery(this.lottery);
    }
  }

  clockRunning() {
    if (this.lottery.dateEnd.getTime() >= new Date().getTime()) {
      var currentTime: any = new Date();
      var timeElapsed = new Date(this.timeBegan - currentTime);
      var hour = timeElapsed.getUTCHours();
      var min = timeElapsed.getUTCMinutes();
      var sec = timeElapsed.getUTCSeconds();
      var ms = timeElapsed.getUTCMilliseconds();

      this.hourOutput = (hour > 9 ? hour : '0' + hour).toString();
      this.minuteOutput = (min > 9 ? min : '0' + min).toString();
      this.secondsOutput = (sec > 9 ? sec : '0' + sec).toString();
      this.miliSecondsOutput = (
        ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms
      ).toString();
    } else {
      this.hourOutput = '00';
      this.minuteOutput = '00';
      this.secondsOutput = '00';
      this.miliSecondsOutput = '00';
      clearInterval(this.started);
      this.presentAlertConfirm();
    }
  }
}
