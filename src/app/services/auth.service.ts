import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;
  uid: string;

  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    private oAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public toastController: ToastController
  ) {
    this.user$ = this.oAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  hasFavorite(sessionName: string): boolean {
    return this.favorites.indexOf(sessionName) > -1;
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  async resetPassword(email: string): Promise<void> {}

  async register(usuario: Customer): Promise<User> {
    try {
      const { user } = await this.oAuth.createUserWithEmailAndPassword(
        usuario.email,
        usuario.password
      );
      await this.updateUserData(usuario, user.uid);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      let message = '';
      if (error.code === 'auth/invalid-email') {
        message = 'Formato de correo inválido';
      } else if (
        (error.code =
          'auth/user-not-found' || error.code === 'auth/wrong-password')
      ) {
        if (
          error.message ===
          'The email address is already in use by another account.'
        ) {
          message = 'Usuario ya existe con el email ingresado';
        } else {
          message = 'Usuario ya existe con el email ingresado';
        }
      } else if ((error.code = 'auth/network-request-failed')) {
        message = 'Verifique su conexion a internet';
      } else if ((error.code = 'auth/email-already-in-use')) {
        message = 'Usuario ya existe con el email ingresado';
      }
      this.presentToast(message);
    }
  }
  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.oAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.uid = user.uid;

      return user;
    } catch (error) {
      let message = '';
      if (error.code === 'auth/invalid-email') {
        message = 'Formato de correo inválido';
      } else if (
        (error.code =
          'auth/user-not-found' || error.code === 'auth/wrong-password')
      ) {
        message = 'Usuario o contraseña no son correctas';
      } else if ((error.code = 'auth/network-request-failed')) {
        message = 'Verifique su conexion a internet';
      }
      this.presentToast(message);
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  async sendVerificationEmail(): Promise<void> {
    return (await this.oAuth.currentUser).sendEmailVerification();
  }

  async logout(): Promise<void> {
    await this.oAuth
      .signOut()
      .then(() => {
        console.log('cerrado con exito');
        this.uid = null;
      })

      .catch((error) => {
        console.log('error', error);
      });
  }

  async updateUserData(customer: Customer, uid: string) {
    await this.afs
      .collection('customer')
      .doc(uid)
      .set({
        ...customer,
        password: '',
        passwordNew: '',
        uid,      
      })
      .catch((err) => console.log('errr 001', err));
  }

  setUid(_uid: string) {
    this.uid = _uid;
  }

  getUid() {
    return this.uid;
  }

  getUserCurrent() {
    return this.oAuth.currentUser;
  }

  async geterror(message: string) {
    await this.afs
      .collection('ErroresApp')
      .add({
        message,
      })
      .catch((err) => console.log('errr 001', err));
  }
}
