import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Customer } from '../models/customer';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private db: AngularFirestore) {}

  async createCustomer(customer: Customer) {
    await this.db
      .collection('customer')
      .add({
        ...customer,
      })
      .catch((err) => console.log('errr 001', err));
  }

  async updateCustomerData(customer: Customer) {
    await this.db
      .collection('customer')
      .doc(customer.id)
      .set({
        ...customer,
      })
      .catch((err) => console.log('errr 001', err));
  }

  getCustomerData(idUser: string) { 
    return this.db
      .collection<Customer>('customer', (ref) => ref.where('uid', '==', idUser))
      .stateChanges()
      .pipe(
        map((customer) => {
          
          return customer.map((a) => {
            const data = a.payload.doc.data() as Customer;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getCustomerDataEmail(email: string) {
    return this.db
      .collection<Customer>('customer', (ref) =>
        ref.where('email', '==', email.toLowerCase())
      )
      .stateChanges()
      .pipe(
        map((customer) => {
          return customer.map((a) => {
            const data = a.payload.doc.data() as Customer;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getCustomerAll() {
    return this.db
      .collection<Customer>('customer')
      .stateChanges()
      .pipe(
        map((customer) => {
          
          return customer.map((a) => {
            const data = a.payload.doc.data() as Customer;
            data.id = a.payload.doc.id;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
}
