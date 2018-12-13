import * as grpcWeb from 'grpc-web';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../sdk/user_pb';
import { UsersClient } from '../../../sdk/user_grpc_web_pb';
import { environment } from '../../../environments/environment';

declare var proto;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  user: any;
  userClient = new UsersClient(environment.apiUrl, null, null);
  constructor(private router: Router) {
    const tsUser = new User();
    this.user = new proto.backend.User();
  }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  signup() {
    const tsUser = new User();
    tsUser.setName(this.user.name);
    tsUser.setTel(this.user.tel);
    tsUser.setPassword(this.user.password);
    this.userClient.add(tsUser, {}, (err: grpcWeb.Error, response: User) => {
      if (err) {
        alert(err.message);
      } else {
        this.router.navigateByUrl('/login');
      }
      console.log(response);
    })
  }
}
