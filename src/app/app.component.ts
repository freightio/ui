import { Component } from '@angular/core';
import { Platform, PopoverController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  username = 'Beckham';
  public appPages = [
    {
      title: '首页',
      url: '/home',
      icon: 'home'
    },
    {
      title: '货运订单',
      url: '/list',
      icon: 'list'
    },
    {
      title: '我的钱包',
      url: '/wallet',
      icon: 'briefcase'
    },
    {
      title: '更多设置',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor(
    private events: Events,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private popoverController: PopoverController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.listenForLoginEvents();
    });
  }

  async login(ev: any) {
    const popover = await this.popoverController.create({
      component: LoginComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', (username) => {
      this.username = username;
    });
  }
}
