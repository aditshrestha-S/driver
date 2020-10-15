import { Component } from '@angular/core';
import { FireService } from './fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './user.model';
import { getLocaleDateFormat } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Driver } from './drivername.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'driver';

  topics=['Raul','Juan','Bulmaro','Jesus','Jimmy','Ray','Valente','Freibel 1','Freibel 2','Alco','Guest'];
  
  
constructor(private fireService:FireService,
            private Fire:AngularFirestore,
            private _snackBar:MatSnackBar,
            public dialog: MatDialog){}

      
            ngOnInit()
               {
                this.openDialog();
                this.getfiredata();
                this.getselectedfiredata();
                this.getdriver()
                
              }

              openDialog() {
                this.dialog.open(DialogComponent);
              }

//form conttrols

//Drivername = new FormControl('', [Validators.required]);
Mobno = new FormControl('', [Validators.minLength(10),Validators.maxLength(10)]);




getErrorMessage() {
  if (this.Mobno.hasError('required')) {
    return 'You must enter a value';
  }

}



Drivername="";
mobileno="";
emailid="";
sample;
errorflag=false;
mobflag=false;
mobflaglength=false;
today;


//adding user on firebase
   fireadd()
    {
      
      this.today=Date();
     
      if(this.Drivername == "Guest")
      {
      
        this.sample={

          "firstname":this.mobileno,
          "timestamp":this.today,
          "mobileno":"+1"+this.mobileno,
          "emailid":this.emailid 
          
            }
      }
      else
      {
      
        this.sample={

                "firstname":this.Drivername,
                "timestamp":this.today,
                "mobileno":"+1"+this.mobileno,
                "emailid":this.emailid 
                
                  }
      }
      
              
      if(this.Drivername==""  )
      {
        this.errorflag=true;
        this.mobflag=false;
        this.mobflaglength=false;

      }
      else if(this.mobileno == "")
      {
        this.mobflag=true;
        this.mobflaglength=false;
        this.errorflag=false;
        
      }
      else if(this.mobileno.length >0 && this.mobileno.length <10 )
      {
        this.mobflaglength=true;
        this.mobflag=false;
        this.errorflag=false;
          
      }
      else
      {
        //console.log(this.Drivername)
        
        //call the add function
        this.Fire.collection('User').add(this.sample);
        this.sendsmstoadmin();
        //console.log(this.sample);

        //disable all error flags
        this.errorflag=false;
        this.mobflag=false;
        this.mobflaglength=false;

        //reset all fields.
        this.Drivername="";
        this.mobileno="";
        this.emailid="";
      
      }
        
      
    }

//function ends


//snacknbar function for success/popup notification

durationInSeconds = 2;
openSnackBarsuccess(message) 
{
  
  this._snackBar.open(message, "", 
  {
    duration: this.durationInSeconds * 1000,
    panelClass: ['success-snackbar']
  });
}
//snacknbar function for success ends here






//getting waiting list  record from firebase function
list:User[];
i;
j;
temp:User;

getfiredata()
{
  

this.fireService.getfiredata().subscribe(actionArray =>{
  this.list=actionArray.map(item=>{
    return{
      id: item.payload.doc.id,
      ...item.payload.doc.data()  as User
    }
    
  });

  //console.log(this.list);
 

  //sorting function for waiting list

  for(this.i=0;this.i<this.list.length;this.i++)
  {
    for(this.j=this.i+1;this.j<this.list.length;this.j++)
    {
      if(this.list[this.i].timestamp > this.list[this.j].timestamp)
      {
       // this.temp=this.list[this.i];
        this.temp=this.list[this.i];
        this.list[this.i]=this.list[this.j];
        this.list[this.j]=this.temp;
      }
    }
  }
//console.log(this.list);


})

}
//function ends here



//getting selectrd list  record from firebase function
k=0;
slength=0;
selected:User[];
added;
getselectedfiredata()
{
this.fireService.getsfiredata().subscribe(actionArray =>{
  this.selected=actionArray.map(item=>{
    return{
      id: item.payload.doc.id,
      ...item.payload.doc.data()  as User
    }
    
  });
  //console.log(this.selected.length);
  //console.log(this.slength);
//
  // Sorting Selected list
  //
  for(this.k=0;this.k<this.selected.length;this.k++)
  {
    for(this.j=this.i+1;this.j<this.selected.length;this.j++)
    {
      if(this.selected[this.k].timestamp < this.selected[this.j].timestamp)
      {
       // this.temp=this.list[this.i];
        this.temp=this.selected[this.k];
        this.selected[this.k]=this.selected[this.j];
        this.selected[this.j]=this.temp;
      }
    }
  }

  //for added user
  if(this.selected.length > this.slength )
  {
    this.slength=this.selected.length;
    this.playAudio();
    
    this.added=this.selected[this.slength-1];
    //this.openSnackBarsuccess(this.selected[this.slength-1].firstname+"  Selected");
    //alert("new user added:"+ this.added);
  }

 
})

  
  
}


//alerts sound function


playAudio(){
  let audio1= new Audio();
  let audio2 = new Audio();
  
  //sound
  audio1.src = "./assets/tweet.mp3";
  audio1.load();
  audio1.play();

  //vibration
  audio2.src = "./assets/vibration2.mp3";
  audio2.load();
  audio2.play();
  
  
}

//getting driver list
driverlist:Driver[];
x;
names=[' '];


getdriver()
    {
            this.fireService.getdrivers().subscribe(actionArray =>
              {
                this.driverlist=actionArray.map(item=>
                {
                  return{
                    id: item.payload.doc.id,
                    ...item.payload.doc.data()  as Driver
                  }
                  
                });
  
                this.names[0]=" ";

                for(this.x=0;this.x<this.driverlist.length;this.x++)
                  {
                    this.names[this.x]=this.driverlist[this.x].name;
                  }
                  console.log(this.names);
             })

    }


     //sending sms function
  
    sendsmstoadmin()
        {
          if(this.Drivername =="Guest")
          {
            this.fireService.sendsmstoadmin(this.mobileno);
          }
          else{
            this.fireService.sendsmstoadmin(this.Drivername);
          }
           
          
        }

    



}
