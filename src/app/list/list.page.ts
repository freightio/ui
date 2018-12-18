import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { OrderList } from '../../sdk/order_pb';
import { User } from '../../sdk/user_pb';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  orders: any[];
  status: string;
  ordersClient = new OrdersClient(environment.apiUrl, null, null);

  constructor() {
    this.orders = [];
  }

  ngOnInit() {
    const tsUser = new User();
    let localUser = window.localStorage.getItem('user');
    if (localUser) {
      tsUser.setTel(JSON.parse(localUser).tel);
    }
    this.ordersClient.listByUser(tsUser, { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: OrderList) => {
        if (err) {
          console.log(err);
        } else {
          for (var i in response.getItemsList()) {
            console.log(i, response.getItemsList()[i])
            let tsOrder = response.getItemsList()[i]
            this.orders[i] = tsOrder.toObject();
            if (tsOrder.getSender() != null) {
              this.orders[i].sender = tsOrder.getSender().toObject();
            }
            if (tsOrder.getFrom() != null) {
              this.orders[i].from = tsOrder.getFrom().toObject();
            }
            if (tsOrder.getTosList()[0] != null) {
              this.orders[i].to = tsOrder.getTosList()[0].toObject();
            }
            this.orders[i].fee = tsOrder.getFee().toFixed(2);
          };
        }
        this.orders = this.orders.filter(order => order.status == this.status);
      });
  }

  refresh(event: any) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}