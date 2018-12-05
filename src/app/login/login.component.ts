import { Component, OnInit } from '@angular/core';
import { Events, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  constructor(
    public events: Events,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  login() {
    window.localStorage.setItem('username', this.username);
    this.events.publish('user:login', this.username);
    this.popoverController.dismiss();
  }
}
