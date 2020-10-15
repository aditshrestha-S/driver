import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FireService 
{

  
          constructor(private fire:AngularFirestore,
                      private http: HttpClient) { }

              
              public data_urlsms='https://driversmsserver.herokuapp.com/senttoadmin'

          formData:User;
          getfiredata()
           {
              return   this.fire.collection('User').snapshotChanges();
           }

          getsfiredata()
            {
              return   this.fire.collection('Admin').snapshotChanges();
            }

          getdrivers()
            {
              return   this.fire.collection('Drivers').snapshotChanges();
            }

            //sending sms function
            sample;
            sendsmstoadmin(varname)
              {
   
                  this.sample=
                  {
                    "name":varname
                  }

                  this.http.post(this.data_urlsms,this.sample).toPromise().then((data:any)=>{
      
            });
    //console.log("Function call")
    

  }



}
