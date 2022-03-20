import { Component, OnInit } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { LotteryDrawService } from '../services/lottery-draw.service';
import { LotteryDraw } from '../models/lottery-draw';
import { CustomerService } from '../services/customer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Customer } from '../models/customer';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  lottery: LotteryDraw;
  timeBegan: any = new Date();
  started: any = null;
  validateH: any = null;
  days = null;
  hourInput: number = 0;
  minuteInput: number = 0;
  secondsInput: number = 0;

  hourOutput: string = '';
  minuteOutput: string = '';
  secondsOutput: string = '';
  miliSecondsOutput: string = '';
  customer: Customer;
  existPlayer: boolean;

  constructor(
    private data: DataService,
    private lotteryDrawService: LotteryDrawService,
    private customerService: CustomerService,
    private Oauth: AngularFireAuth,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
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
            this.existPlayer = this.lottery.players?.filter(data => data.uid === this.customer.uid).length>0;
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
            this.minuteInput = minutes;
            this.secondsInput = seconds;
            this.timeBegan = new Date();
            this.timeBegan.setHours(this.timeBegan.getHours() + this.hourInput);
            this.timeBegan.setMinutes(
              this.timeBegan.getMinutes() + this.minuteInput
            );
            this.timeBegan.setSeconds(
              this.timeBegan.getSeconds() + this.secondsInput
            );
          });
        this.validateH = setInterval(() => {
          if (this.lottery) {
            this.clockRunning();
          }
        }, 10);

        });
      }
    });
   
  }

  async presentAlertConfirm() {
    let dollarUSLocale = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
  });
    let priceUsd = dollarUSLocale.format(this.lottery.price);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseas comprar tu acceso al juego',
      message: `al dar aceptar de tu saldo se descontará <strong>${priceUsd}</strong>?`,
      buttons: [
        {
          text: 'Regresar',
          role: 'cancel',
          cssClass: 'primary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Acceder',
          id: 'confirm-button',
          handler: () => {
            this.presentLoading();
          }
        }
      ]
    });

    await alert.present();
  }

    async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Un momento por favor...',
      spinner: 'lines-sharp-small',
    });
    await loading.present().then(() => {
      if(!this.lottery.players){
        this.lottery.players = [];
      }
      this.customer.position = this.validatePosition();
      this.customer.positionOne = this.customer.position.split('')[0] + this.customer.position.split('')[1],
      this.customer.positionTwo=this.customer.position.split('')[2] + this.customer.position.split('')[3],
      this.customer.verificado=false;
      this.customer.lastCron='';
      this.customer.points=0;
      this.customer.accountBalance = this.customer.accountBalance - 5000;
      this.lottery.players.push(this.customer);
      this.lottery.positions=this.lottery.positions +1;
      this.lottery.winningPot= this.lottery.acumulate + (5000*90)/100;
      this.lottery.profit=  this.lottery.winningPot + (5000*10)/100;
      this.lottery.acumulate = this.lottery.acumulate + 5000;
      this.lotteryDrawService.updateLottery(this.lottery).then(data=> {
        
        this.existPlayer=true;
         this.customerService.updateCustomerData(this.customer).then(data => {
          loading.dismiss();
         });
        
      });
    });
  }

  playing(){
    if(new Date().getTime()  >= this.lottery.date.getTime() &&  (this.lottery.date.getMinutes()+5)< new Date().getTime()){
      this.router.navigate(['/game'], { replaceUrl: true }); 
    }else {
      this.presentAlertConfirmJ();
    }
  }

  async presentAlertConfirmJ() {
    const month = ("0" + (new Date(this.lottery.date).getMonth() + 1)).slice(-2);
    const date = ("0" + (new Date(this.lottery.date).getDate())).slice(-2);
    const hour = ("0" + (new Date(this.lottery.date).getHours())).slice(-2);
    const minutes = ("0" + (new Date(this.lottery.date).getMinutes())).slice(-2);

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
          }
        }
      ]
    });

    await alert.present();
  }
  

  validatePosition(): string {
    if(this.lottery.positions<10){
      return '000'+this.lottery.positions;
    }else if(this.lottery.positions<100){
      return '00'+this.lottery.positions;
    }else if(this.lottery.positions<1000){
      return '0'+this.lottery.positions;
    }
    return ''+this.lottery.positions;
  }


  clockRunning() {
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
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }
}
