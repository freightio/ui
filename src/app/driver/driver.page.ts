import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  users: any;
  constructor() {
    this.users = [
      { 'name': '用户1', 'type': '小面包车', 'time': '2018-12-12,16:16', 'from': '三里屯', 'to': '天安门', 'fee': 66.66 },
      { 'name': '用户2', 'type': '大货车', 'time': '2018-12-12,18:18', 'from': '三里屯', 'to': '天安门', 'fee': 88.88 },
      { 'name': '用户3', 'type': '中货车', 'time': '2018-12-12,19:19', 'from': '三里屯', 'to': '天安门', 'fee': 99.99 }
    ];
  }

  ngOnInit() {
  }

  showUserDetail(user) {
    alert('正在开发中.' + user.name);
  }
}
