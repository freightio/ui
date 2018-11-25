import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { Order, OrderList } from '../../sdk/order_pb';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  orders: {}[];
  constructor() {
    this.orders = [
      { 'name': '用户1', 'type': '小面包车', 'time': '2018-12-12,16:16', 'from': '三里屯', 'to': '天安门', 'fee': 66.66 },
      { 'name': '用户2', 'type': '大货车', 'time': '2018-12-12,18:18', 'from': '三里屯', 'to': '天安门', 'fee': 88.88 },
      { 'name': '用户3', 'type': '中货车', 'time': '2018-12-12,19:19', 'from': '三里屯', 'to': '天安门', 'fee': 99.99 }
    ];
  }

  ngOnInit() {
    const ordersClient = new OrdersClient(environment.apiUrl, null, null);
    const order = new Order();
    ordersClient.list(order, { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: OrderList) => {
        console.log(err);
        console.log(response.getOrdersList())
        alert(response.getOrdersList());
      });
  }

  showUserDetail(user) {
    alert('正在开发中.' + user.name);
  }
}
