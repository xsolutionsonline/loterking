import { Component, OnInit } from '@angular/core';
import { LotteryDraw } from '../../models/lottery-draw';
import { LotteryDrawService } from '../../services/lottery-draw.service';
import { CustomerService } from '../../services/customer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer';
import { PlayerLottery } from '../../models/playerLottery';
var moment = require('moment'); // require

@Component({
  selector: 'app-game-special',
  templateUrl: './gameSpecial.page.html',
  styleUrls: ['./gameSpecial.page.scss'],
})
export class GamePageSpecial implements OnInit {
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
  players: PlayerLottery[];
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
  pointsCustomer: number;
  verificado: boolean;
  gameFirst: boolean = true;

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
          this.verificado =
            this.route.snapshot.paramMap.get('verificado') === 'true';
            debugger;
          this.lotteryDrawService.getLotteryDrawById(id).subscribe((data) => {
            this.lottery = data[0];

            if (
              new Date().getTime() >= this.lottery.date.getTime() &&
              new Date().getTime() <= this.lottery.dateEnd.getTime() &&
              this.lottery.date.getMinutes() + 5 < new Date().getTime()
            ) {
              if (this.lottery?.players?.length < 1000) {
                this.createdRobots();
              }

              this.beginGame();
            } else {
              if(new Date().getTime() < this.lottery.date.getTime()){
                this.createdCronos();
                this.presentAlertConfirmJ();  
              }
              
            }
          });
          this.started = setInterval(() => {
            if (
              new Date().getTime() >= this.lottery?.date.getTime() &&
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
              let url = '/gameSpecial/';
              if (this.lottery.online) {
                url = '/game/';
              }
              if (this.router.url === url && this.initView) {
                this.presentAlertConfirmJ();
              }
            }
          }, 50);
        });
        if (!this.started1) {
          this.started1 = setInterval(() => {
            if (this.lottery && this.startGame) {
              //this.clockRunning();
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

  currentDate: any;
  targetDate: any;
  cDateMillisecs: any;
  tDateMillisecs: any;
  difference: any;
  seconds: any;
  minutes: any;
  hours: any;
  days1: any;
  year: number = 2023;
  month: number = 6;

  ngDoCheck() {
   if (this.lottery && this.startGame) {
      this.myTimer();
    }
  }

  myTimer() {
    var currentTime: any = new Date();
    if (this.timeBegan - currentTime > 0) {
    this.currentDate = new Date();
    this.targetDate =this.timeBegan;
    this.cDateMillisecs = this.currentDate.getTime();
    this.tDateMillisecs = this.targetDate.getTime();
    this.difference = this.tDateMillisecs - this.cDateMillisecs;
    this.seconds = Math.floor(this.difference / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);
    this.days1 = Math.floor(this.hours / 24);

    this.hours %= 24;
    this.minutes %= 60;
    this.seconds %= 60;
    this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
    this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;

    //document.getElementById('days').innerText = this.days;
    //document.getElementById('hours').innerText = this.hours;
    this.minuteOutput= this.minutes;
    this.secondsOutput = this.seconds;
    this.miliSecondsOutput = ''+new Date().getMilliseconds();

    //setInterval(this.myTimer, 1000);
    }else {
      this.hourOutput = '00';
      this.minuteOutput = '00';
      this.secondsOutput = '00';
      this.miliSecondsOutput = '00';
      this.presentAlertConfirm();
    }
  }

  createdCronos() {
    if (this.verificado) {
      let minutes = 0;
      let seconds = 0;
      const fecha1 = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
      const fecha2 = moment(this.lottery.date, "YYYY-MM-DD HH:mm:ss");

      this.days = fecha2.diff(fecha1, 'd');
      this.hourInput = fecha2.diff(fecha1, 'h');
      minutes =fecha2.diff(fecha1, 'm');
      seconds = 60 - new Date().getSeconds();

      this.minuteInput = minutes;
      this.secondsInput = seconds;
      this.timeBegan.setHours(this.hourInput);
      this.timeBegan.setMinutes(this.minuteInput);
      this.timeBegan.setSeconds(this.secondsInput);
    

      this.validateH = setInterval(() => {
        if (this.lottery) {
          this.clockRunningH();
        }
      }, 10);
    }
  }

  clockRunningH() {
    var currentTime: any = new Date();
    if((this.lottery.date.getTime() - currentTime.getTime())<0){
      this.hourOutput = '00';
      this.minuteOutput = '00';
      this.secondsOutput = '00'; 
     
      return true;
    }
    let minutes = 0;
    let seconds = 0;
    const fecha1 = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
    const fecha2 = moment(this.lottery.date, "YYYY-MM-DD HH:mm:ss");

    this.days = fecha2.diff(fecha1, 'd');
    this.hourInput = fecha2.diff(fecha1, 'h');
    
     minutes =fecha2.diff(fecha1, 'm');
    seconds = 60 - new Date().getSeconds();

    
    this.minuteInput = minutes;
    this.secondsInput = seconds;
    this.timeBegan.setHours(this.hourInput);
    this.timeBegan.setMinutes(this.minuteInput);
    this.timeBegan.setSeconds(this.secondsInput);
    
     //var timeElapsed = new Date(this.timeBegan - currentTime);
     var hour = this.timeBegan.getHours();
     var min  = this.timeBegan.getMinutes();
     var sec  = this.timeBegan.getSeconds();
    
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

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'el juego HA FINALIZADO ',
        message: ` SU PUNTUACION ES:<strong>${this.pointsCustomer}</strong>, EL GANADOR SERÁ PUBLICADO AL FINALIZAR EL SORTEO`,
        buttons: [
          {
            text: 'Salir',
            role: 'cancel',
            cssClass: 'primary',
            id: 'cancel-button',
            handler: (blah) => {
              const index = this.playersView.findIndex(
                (data) => data.uid === this.customer.uid
              );
              const index1 = this.lottery.players.findIndex(
                (data) => data.uid === this.customer.uid
              );
              this.lottery.players[index1] = this.playersView[index];
              this.lottery.players[index1].verificado = false;
              this.lottery.players[index1].points = this.pointsCustomer;
              this.lottery.players[index1].src =  'assets/img/redButton.jpg';

              this.lotteryDrawService.updateLottery(this.lottery).then(() => {
                this.playersView = null;
                this.startGame = false;
                this.router.navigate(['/home']);
              });
            },
          },
        ],
      });

      await alert.present();
    }
  }

  back(){
    this.router.navigate(['/home']);
  }

  beginGame() {
    
      this.lotteryDrawService.getPlayerLottery().subscribe((data) => {
        this.players = data;
        this.updatePlayers();
        this.player = this.lottery.players?.find(
          (data) => data.uid === this.customer.uid
        );

        if(!this.verificado){
          this.playersView = this.lottery.players;
        }
        if (!this.playersView &&  this.verificado) {
          this.playersView = this.lottery.players;

          this.minuteInput = 5;
          this.secondsInput = 0;
          this.timeBegan = new Date();

          this.timeBegan.setMinutes(
            this.timeBegan.getMinutes() + this.minuteInput
          );
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
          if (this.playersView[index].uid !== this.customer.uid) {
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
      if(this.gameFirst){
        this.gameFirst = false;
        const custGame = this.playersView.find(data => data.uid === this.customer.uid);
        this.playersView = this.playersView.filter(odata => this.customer.uid !== odata.uid);
        this.playersView.unshift(custGame);
      }
      

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
    const index = this.playersView.findIndex(
      (data) => data.uid === this.customer.uid
    );
    playerU.points = playerU.points + 1;
    this.pointsCustomer = playerU.points;
    playerU.lastCron =
      this.minuteOutput +
      ':' +
      this.secondsOutput +
      ':' +
      this.miliSecondsOutput;

    this.lotteryDrawService.updatePLayerLottery(playerU);

    if (index >= 0) {
      this.playersView[index] = playerU;
      this.playersView[index].src = 'assets/img/greenButton.jpg';
    }
  }

  clockRunningT() {
    var currentTime: any = new Date();
    if (this.timeBegan - currentTime > 0) {
      var timeElapsed = new Date(this.timeBegan - currentTime);
      var min = timeElapsed.getMinutes();
      var sec = timeElapsed.getSeconds();
      var ms = timeElapsed.getMilliseconds();

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
