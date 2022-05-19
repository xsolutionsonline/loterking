import { Component, OnInit } from '@angular/core';
import { LotteryDraw } from '../../models/lottery-draw';
import { LotteryDrawService } from '../../services/lottery-draw.service';
import { CustomerService } from '../../services/customer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer';
import { PlayerLottery } from '../../models/playerLottery';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  timeBegan: any = new Date();
  started: any = null;
  started1: any = null;
  winner: string = 'AAAAAA';
  minuteInput: number = 0;
  secondsInput: number = 0;

  hourOutput: string = '';
  minuteOutput: string = '';
  secondsOutput: string = '';
  miliSecondsOutput: string = '';
  lottery: LotteryDraw;
  players : PlayerLottery[];
  customer: Customer;
  player: Customer;
  playersView: PlayerLottery[];
  startGame: boolean = false;
  finishedGame: boolean;
  viewAlert: boolean = false;
  initView: boolean = false;

  hourOutputH: string = '';
  minuteOutputH: string = '';
  secondsOutputH: string = '';

  days = null;
  hourInput: number = 0;
  minuteInputH: number = 0;
  secondsInputH: number = 0;
  validateH: any = null;

  constructor(
    private lotteryDrawService: LotteryDrawService,
    private customerService: CustomerService,
    private Oauth: AngularFireAuth,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.Oauth.authState.subscribe((user: any) => {
      if (user) {
        this.customerService.getCustomerData(user.uid).subscribe((data) => {
          this.customer = data[0];
          const id = this.route.snapshot.paramMap.get('id');
          this.lotteryDrawService.getLotteryDrawById(id).subscribe((data) => {
            this.lottery = data[0];

            if (
              new Date().getTime() >= this.lottery.date.getTime() &&
              this.lottery.date.getMinutes() + 5 < new Date().getTime()
            ) {
              if (this.lottery?.players?.length < 1000) {
                this.createdRobots();
              }
              this.beginGame();
             
            } else {
              this.createdCronos();
              this.presentAlertConfirmJ();
            }
          });
          this.started = setInterval(() => {
           if (
              new Date().getTime() >= this.lottery?.date.getTime() &&
              this.lottery?.date.getMinutes() + 5 < new Date().getTime() &&
              !this.startGame
            ) {
              if (this.lottery?.players?.length < 1000) {
                this.createdRobots();
              }
              this.beginGame();
              if (this.viewAlert) {
                this.viewAlert = false;
                this.alertController?.dismiss();
              }
            } else {
              if (this.router.url === '/game' && this.initView) {
                this.presentAlertConfirmJ();
              }
            }
          }, 50);
          
        });
        if(!this.started1){
          this.started1 = setInterval(() => {
            if (this.lottery && this.startGame) {
             
              this.clockRunning();
              if (this.viewAlert) {
                this.viewAlert = false;
                this.alertController?.dismiss();
              }
            }
          }, 10);
        }
      }
    });
  }

  createdCronos() {
            let days = this.lottery.date.getDate() - (new Date().getDate()+1);
            let hours = 0;
            let minutes = 0;
            let seconds = 0;
    
    
            hours = 24 - new Date().getHours();
            minutes = 60 - new Date().getMinutes();
            seconds = 60 - new Date().getSeconds();
    
            let totalH = hours +this.lottery.date.getHours();
      
            if(totalH>=24){
              totalH = 24 - totalH;
              days = days + 1;
            }else{
              totalH=totalH-1;
            }
    
            if (days > 1) {
              this.days = days + 'DIAS ';
            } else if (days === 1) {
              
              this.days = days + 'DIA ';
              totalH = this.lottery.date.getHours() - new Date().getHours();
              if(totalH<=0){
                this.days=0 + 'DIAS';
              }
              if(minutes<60){
                totalH=totalH-1;
              }
            } else {
              this.days = 0 + 'DIAS ';
              totalH = this.lottery.date.getHours() - new Date().getHours();
              minutes = this.lottery.date.getMinutes() - new Date().getMinutes();
          
            }
           
    
            this.hourInput = totalH;
            this.minuteInputH = minutes;
            this.secondsInputH = seconds;
            this.timeBegan = new Date();
            this.timeBegan.setHours(this.timeBegan.getHours() + this.hourInput);
            this.timeBegan.setMinutes(
              this.timeBegan.getMinutes() + this.minuteInputH
            );
            this.timeBegan.setSeconds(
              this.timeBegan.getSeconds() + this.secondsInputH
            );
            this.validateH = setInterval(() => {
              if (this.lottery) {
                this.clockRunningH();
              }
            }, 10);
  }

  clockRunningH() {
    var currentTime: any = new Date();
    if((this.timeBegan - currentTime)<0){
      this.hourOutputH = '00';
      this.minuteOutputH = '00';
      this.secondsOutputH = '00'; 
      return true;
    }
    var timeElapsed = new Date(this.timeBegan - currentTime);
    var hour = timeElapsed.getUTCHours();
    var min = timeElapsed.getUTCMinutes();
    var sec = timeElapsed.getUTCSeconds();
    var ms = timeElapsed.getUTCMilliseconds();
    
    this.hourOutputH = (hour > 9 ? hour : '0' + hour).toString();
    this.minuteOutputH = (min > 9 ? min : '0' + min).toString();
    this.secondsOutputH = (sec > 9 ? sec : '0' + sec).toString();        
  }

  createdRobots() {
    let robot: Customer;
    while (this.lottery.players.length < 1000) {
      let positions = this.validatePosition();
      robot = {
        status: true,
        accountBalance: 0,
        userName: 'Player' + (this.lottery.players.length + 1),
        names: 'Player' + (this.lottery.players.length + 1),
        position: positions,
        positionOne:
          positions.split('')[0] + this.customer.position.split('')[1],
        positionTwo:
          positions.split('')[2] + this.customer.position.split('')[3],
        verificado: false,
        lastCron: '05:00:000',
        points: 0,
        uid: 'player' + this.lottery.players.length + 1,
        color: '',
      };
      this.lottery.positions = this.lottery.positions + 1;
      this.lottery.players.push(robot);
    }

    this.lotteryDrawService.updateLottery(this.lottery);
  }

  async presentAlertConfirmJ() {
    if (!this.viewAlert) {
      this.viewAlert = true;
      this.initView = true;
      const month = ('0' + (new Date(this.lottery.date).getMonth() + 1)).slice(
        -2
      );
      const date = ('0' + new Date(this.lottery.date).getDate()).slice(-2);
      const hour = ('0' + new Date(this.lottery.date).getHours()).slice(-2);
      const minutes = ('0' + new Date(this.lottery.date).getMinutes()).slice(
        -2
      );

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'el juego aún no comienza',
        message: `debes estar atento el juego comienza el <strong>${date}/${month}/${this.lottery.date.getFullYear()}</strong>
      a las <strong> ${hour}:${minutes}</strong>?`,
        buttons: [
          {
            text: 'Regresar',
            role: 'cancel',
            cssClass: 'primary',
            id: 'cancel-button',
            handler: (blah) => {
              this.viewAlert = false;
              this.router.navigate(['/home']);
            },
          },
        ],
      });

      await alert.present();
    }
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
        message: `EL GANADOR ES <strong>${winner?.userName}</strong> <p>segundo lugar ${this.playersView[1].names} </p> <p>tercer lugar ${this.playersView[2].names} </p> <p>cuarto lugar ${this.playersView[3].names} </p>`,
        buttons: [
          {
            text: 'Salir',
            role: 'cancel',
            cssClass: 'primary',
            id: 'cancel-button',
            handler: (blah) => {
              //this.lotteryDrawService.createHistoryLottery(this.lottery).then(() => {
              this.lottery.players = null;
              this.lottery.positions = 0;
              this.lottery.date.setDate(
                this.lottery.date.getDate() + this.lottery.dateAdd
              );
              this.lottery.dateEnd.setDate(
                this.lottery.dateEnd.getDate() + this.lottery.dateAdd
              );
              this.lottery.acumulate = 0;
              this.lottery.profit = 0;
              this.lottery.winningPot = 0;
              this.lotteryDrawService.updateLottery(this.lottery).then(() => {
                this.playersView = null;
                this.startGame = false;
                this.router.navigate(['/home']);
              });

              // });
            },
          },
        ],
      });

      await alert.present();
    }
  }

  beginGame() {
    this.lotteryDrawService.getPlayerLottery().subscribe(data => {
      this.players = data;
      this.updatePlayers();
    this.player = this.lottery.players?.find(
      (data) => data.uid === this.customer.uid
    );

    if (!this.playersView) {
      this.playersView = this.lottery.players;

      let minutes = 0;
      let seconds = 0;
      var timeElapsed = new Date(
        this.lottery.dateEnd.getMinutes() - new Date().getMinutes()
      );
      minutes = timeElapsed.getMinutes();
      seconds = timeElapsed.getSeconds();

      this.minuteInput = minutes;
      this.secondsInput = seconds;
      this.timeBegan = new Date();

      this.timeBegan.setMinutes(this.timeBegan.getMinutes() + this.minuteInput);
      this.timeBegan.setSeconds(
        this.timeBegan.getSeconds() + this.secondsInput
      );
      this.startGame = true;
    }
    
    });
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
    if (this.playersView && this.lottery?.players) {
      this.players.map((data) => {
        const index = this.playersView.findIndex(
          (odata) => odata.uid === data.uid
        );
        if (index >= 0) {
          if(this.playersView[index].uid !== this.customer.uid){
            this.playersView[index].points = data.points;
            this.playersView[index].lastCron = data.lastCron;
          }
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
      this.playersView[1].color = 'blue';
      this.playersView[2].color = 'blue';
      this.playersView[3].color = 'blue';
    }
  }

  updatePlayer(playerU: PlayerLottery) {
    const index = this.playersView.findIndex(
      (data) => data.uid === playerU.uid
    );
    if (index >= 0) {
      this.playersView[index] = playerU;
    }

    const indexC = this.playersView.findIndex(
      (odata) => odata.uid === this.customer.uid
    );
    
    if (this.playersView[indexC].src === 'assets/img/greenButton.jpg') {
      this.playersView[indexC].src = 'assets/img/redButton.jpg';
      this.playersView[indexC].status = true;
      this.customer.status = true;
    }
  }

  updatePlayerCustomer(playerU: PlayerLottery) {
    const index = this.playersView.findIndex(data => data.uid === this.customer.uid);
    playerU.points = playerU.points + 1;
    playerU.lastCron =
        this.minuteOutput +
        ':' +
        this.secondsOutput +
        ':' +
        this.miliSecondsOutput;
        
        this.lotteryDrawService.updatePLayerLottery(playerU);    
        
        if(index>=0){
          this.playersView[index] = playerU;
          this.playersView[index].src = 'assets/img/greenButton.jpg';
        }
      
  }


  clockRunning() {
    if (this.lottery.dateEnd.getTime() >= new Date().getTime()) {
      var currentTime: any = new Date();
      var timeElapsed = new Date(this.lottery.dateEnd - currentTime);
      var min = timeElapsed.getUTCMinutes();
      var sec = timeElapsed.getUTCSeconds();
      var ms = timeElapsed.getUTCMilliseconds();
      
      this.minuteOutput = (min > 9 ? min : '0' + min).toString();
      this.secondsOutput = (sec > 9 ? sec : '0' + sec).toString();
      this.miliSecondsOutput = (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms).toString();
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
