import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  constructor(
    private events: Events,
    private router: Router, ) { }

  ngOnInit() {
  }
  
  login() {
    window.localStorage.setItem('username', this.username);
    this.events.publish('user:login', this.username);
    this.router.navigateByUrl('/home');
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
