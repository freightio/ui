import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { Order, OrderList } from '../../sdk/order_pb';

//declare var proto;

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  orders: any[];
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  constructor(
    private alertController: AlertController,
  ) {
    this.orders = [
      { 'name': '用户1', 'type': '小面包车', 'time': '2018-12-12,16:16', 'from': '三里屯', 'to': '天安门', 'fee': 66.66 },
      { 'name': '用户2', 'type': '大货车', 'time': '2018-12-12,18:18', 'from': '三里屯', 'to': '天安门', 'fee': 88.88 },
      { 'name': '用户3', 'type': '中货车', 'time': '2018-12-12,19:19', 'from': '三里屯', 'to': '天安门', 'fee': 99.99 }
    ];
  }

  ngOnInit() {
    this.ordersClient.list(new Order(), { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: OrderList) => {
        for (var i in response.getItemsList()) {
          let tsOrder = response.getItemsList()[i]
          this.orders[i] = tsOrder.toObject();
          if (tsOrder.getContact() != null) {
            this.orders[i].contact = tsOrder.getContact().toObject();
          }
          if (tsOrder.getFrom() != null) {
            this.orders[i].from = tsOrder.getFrom().toObject();
          }
          if (tsOrder.getTosList()[0] != null) {
            this.orders[i].to = tsOrder.getTosList()[0].toObject();
          }
          this.orders[i].fee = tsOrder.getFee().toFixed(2);
          // let a = <Order>response.getItemsList()[i];
          // let order = new proto.backend.Order();
          // order.time = a.getId();
          // order.contact = a.getContact();
          // order.from = a.getFrom();
          // order.tos = a.getTosList();
          // order.type = a.getType();
          // order.fee = a .getFee();
          // this.orders[i] = order;
        };
        //alert(response.getOrdersList());
      });
  }

  async showUserDetail(order) {
    const alert = await this.alertController.create({
      header: '确认接单',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '确定',
          handler: data => {
            this.ordersClient.update(new Order(), { 'custom-header-1': 'value1' },
              (err: grpcWeb.Error, response: Order) => {
                console.log(response);
              });
          }
        }
      ]
    });
    await alert.present();
  }

}
