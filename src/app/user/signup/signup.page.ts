import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsersClient } from '../../../sdk/user_grpc_web_pb';
import { User, UserRequest } from '../../../sdk/user_pb';

declare var proto;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  user: any;
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
    alert(this.user.tel + ':' + this.user.name);
    // this.router.navigateByUrl('/signup');
  }
}
