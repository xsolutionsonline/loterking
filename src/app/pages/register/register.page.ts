import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Customer } from '../../models/customer';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string;
  password: string;
  typePassword = 'password';
  registerForm: FormGroup;
  usuario: Customer;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,    
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      names: [null, Validators.required],
      email: ['', Validators.required],
      emailNew: ['', Validators.required],
      password: ['', Validators.required],
      passwordNew: ['', Validators.required],
      country: ['', Validators.required],
      userName:[null, Validators.required],
    });
  }

  async OnSubmitRegister() {
    this.usuario = {
      ...this.registerForm.value,
      dni: '',
      version: environment.version,
      status:true,
      color:''
    };
    if (this.registerForm.value.names) {
      if (this.registerForm.value.email === this.registerForm.value.emailNew) {
        if (
          this.registerForm.value.password ===
          this.registerForm.value.passwordNew
        ) {
          await this.authService.register(this.usuario).then((user) => {
            if (user) {
              this.presentToast(
                'Felicitaciones !!! , te has registrado como usuario'
              );
            }
          });
        } else {
          this.presentToast('las contraseñas son diferentes');
        }
      } else {
        this.presentToast('los email son diferentes');
      }
    } else {
      this.presentToast('el nombre es obligatorio');
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  viewPassword(type) {
    this.typePassword = type;
  }
}
