import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Customer } from '../../models/customer';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  customer: Customer;
  loginForm: FormGroup;
  version:string;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private Oauth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.version= environment.version;
    this.Oauth.authState.subscribe((user: any) => {
      if (user) {
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async onSubmitLogin() {
    
    if (
      this.loginForm.controls['email'].value === null ||
      this.loginForm.controls['password'].value === null
    ) {
      return this.presentToast('Los campos email y contaseña son requeridos');
    } else {
      await this.auth
        .login(
          this.loginForm.controls['email'].value,
          this.loginForm.controls['password'].value
        )
        .then((data) => {
          if (data) {
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        });
    }
  }
}
