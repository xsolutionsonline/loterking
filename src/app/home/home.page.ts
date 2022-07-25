import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { LotteryDrawService } from '../services/lottery-draw.service';
import { LotteryDraw } from '../models/lottery-draw';
import { CustomerService } from '../services/customer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Customer } from '../models/customer';
import { AlertController, IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlayerLottery } from '../models/playerLottery';
var moment = require('moment'); // require

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slideHome') slider: IonSlides;
  lottery: LotteryDraw;
  lotteries: LotteryDraw[];
  timeBegan: Date = new Date();
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

  slideOpts:any =  {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };
  
        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function() {
        const swiper = this;
        const {
          $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }
  
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + (round * 4 * swiperSize);
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = (3 * swiperSize) + (swiperSize * 4 * round);
          }
          if (rtl) {
            tx = -tx;
          }
  
           if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }
  
           const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = (slideIndex * 90) + (progress * 90);
            if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });
  
         if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
            const multiplier = 1.5 - (
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
              + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
            );
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }
  
        const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
        $wrapperEl
          .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      },
      setTransition: function(duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    }
  };
  
  gamer: PlayerLottery;
  message: boolean = true;

  constructor(
    private data: DataService,
    private lotteryDrawService: LotteryDrawService,
    private customerService: CustomerService,
    private Oauth: AngularFireAuth,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,  
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Un momento por favor...',
      spinner: 'lines-sharp-small',
    });
    await loading.present().then(() => {
      this.Oauth.authState.subscribe((user: any) => {
        if (user) {
          this.customerService.getCustomerData(user.uid).subscribe((data) => {
            this.customer = data[0];
          
            this.lotteryDrawService
            .getLotteryDrawById('JfWIRLA0R1qKqGnLJOxG')
            .subscribe((data) => {
              this.lotteries = data;
              this.lottery = data[0];
              this.gamer = this.lottery?.players?.find(data=> data.uid === this.customer.uid);
  
              this.createdCronos();
              loading.dismiss();
            });   
          });
        }
      });
    });
    
   
  }
  createdCronos() {
   
    this.existPlayer = this.lottery.players?.filter(data => data.uid === this.customer.uid).length>0;
            let minutes = 0;
            let seconds = 0;
            const fecha1 = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
            const fecha2 = moment(this.lottery.date, "YYYY-MM-DD HH:mm:ss");

            this.days = fecha2.diff(fecha1, 'd');
            this.hourInput = fecha2.diff(fecha1, 'h');
            minutes = 60 - new Date().getMinutes();
            seconds = 60 - new Date().getSeconds();

            this.minuteInput = minutes;
            this.secondsInput = seconds;
            this.timeBegan.setHours(this.hourInput);
            this.timeBegan.setMinutes(this.minuteInput);
            this.timeBegan.setSeconds(this.secondsInput);
            this.validateH = setInterval(() => {
              if (this.lottery) {
                this.clockRunning();
              }
            }, 10);
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
      this.customer.verificado=true;
      this.customer.lastCron='';
      this.customer.points=0;
      this.customer.accountBalance = this.customer.accountBalance - 5000;
      this.lottery.positions=this.lottery.positions +1;
      this.lottery.winningPot= this.lottery.acumulate + (5000*90)/100;
      this.lottery.profit=  this.lottery.winningPot + (5000*10)/100;
      this.lottery.acumulate = this.lottery.acumulate + 5000;
      const playerLotery :PlayerLottery = {
        ...this.customer,
        id:this.customer.uid
      };
      this.lottery.players.push(playerLotery);
      this.lotteryDrawService.updateLottery(this.lottery).then(data=> {
        
        
        this.existPlayer=true;
         this.customerService.updateCustomerData(this.customer).then(data => {
           this.lotteryDrawService.updatePLayerLottery(playerLotery).then(()=> {
            loading.dismiss();
           });
            
         });
        
      });
    });
  }

  playing(){
    if(this.message){
    let url = '/gameSpecial/'
    if(new Date().getTime() >= this.lottery.date.getTime() &&
      new Date().getTime() <= this.lottery.dateEnd.getTime()){
    if(this.lottery.online){
      url= '/game/';
      this.router.navigate([ url +
      this.lottery.id], { replaceUrl: true }); 
    }else {
      
        this.router.navigate([ url +
          this.lottery.id + '/'+this.gamer.verificado], { replaceUrl: true }); 
    }
  }else {
    this.router.navigate([ url +
      this.lottery.id + '/'+this.gamer.verificado], { replaceUrl: true }); 
  }
  }else {
    this.presentToast('el juego ya ha finalizado y no puedes jugar')
  }
     
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
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

  changeSlide(event){
    this.slider.getActiveIndex().then(index => {
      console.log('activo ',index);
      this.lottery = this.lotteries[index];
      this.createdCronos();
   });    
  }


  clockRunning() {
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

    var currentTime: Date = new Date();
    
    this.message = true;
    if((this.lottery.date.getTime() - currentTime.getTime())<0){
      this.hourOutput = '00';
      this.minuteOutput = '00';
      this.secondsOutput = '00'; 
      if((this.lottery.dateEnd.getTime() - currentTime.getTime())<0){
        this.message = false;       
      }
      return true;
    }

    
    //var timeElapsed = new Date(this.timeBegan - currentTime);
    var hour = this.timeBegan.getHours();
    var min  = this.timeBegan.getMinutes();
    var sec  = this.timeBegan.getSeconds();
    
    this.hourOutput = (hour > 9 ? hour : '0' + hour).toString();
    this.minuteOutput = (min > 9 ? min : '0' + min).toString();
    this.secondsOutput = (sec > 9 ? sec : '0' + sec).toString();
    this.miliSecondsOutput =  ''+this.timeBegan.getMilliseconds();
    
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  payu(){
    let url = '/payulist/'+this.customer.uid
    this.router.navigate([ url +
      this.lottery.id], { replaceUrl: true });

  }

  menu(){
    
  }
}
