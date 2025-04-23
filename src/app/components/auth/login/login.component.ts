import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName="";
  password="";
  data;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    let obj = JSON.stringify({ userName: this.userName, password: this.password });
    this.authService.login(obj)
      .subscribe(arg => {
        if(arg){
          this.redirect();
        }
        console.log(this.data)
      });
  }
  
  redirect(){
    this.router.navigate(['/dashboard']);
  }

}
