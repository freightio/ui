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
  tel = '';
  password = '';
  userClient = new UsersClient(environment.apiUrl, null, null);
  constructor(
    private events: Events,
    private router: Router, ) { }

  ngOnInit() {
  }

  login() {
    const tsUser = new User();
    tsUser.setTel(this.tel);
    tsUser.setPassword(this.password);
    this.userClient.login(tsUser, {}, (err: grpcWeb.Error, response: User) => {
      if (err) {
        console.log(err.code, err.message);
        alert('手机号或密码不正确.');
        return
      } else {
        console.log(this.tel)
        window.localStorage.setItem('userId', this.tel);
        this.events.publish('user:login', response.getName());
        this.router.navigateByUrl('/home');
      }
      console.log(response);
    })
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
