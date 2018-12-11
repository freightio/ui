import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { User } from '../../../sdk/user_pb';
import { UsersClient } from '../../../sdk/user_grpc_web_pb';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  userClient = new UsersClient(environment.apiUrl, null, null);
  constructor(
    private events: Events,
    private router: Router, ) { }

  ngOnInit() {
  }

  login() {
    const tsUser = new User();
    tsUser.setTel(this.username);
    tsUser.setPassword(this.password);
    this.userClient.login(tsUser, {}, (err: grpcWeb.Error, response: User) => {
      if (err) {
        console.log(err.code, err.message);
        alert('手机号码或密码不正确!');
        return
      } else {
        window.localStorage.setItem('username', this.username);
        this.events.publish('user:login', this.username);
        this.router.navigateByUrl('/home');
      }
      console.log(response);
    })
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
