import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { Order, OrderList, Position } from '../../sdk/order_pb';

//declare var proto;
declare var AMap;

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  orders: any[];
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  //currentLocation: any;
  constructor(
    private geolocation: Geolocation,
    private alertController: AlertController
  ) {
    this.orders = [
      { 'sender': { 'name': '用户1' }, 'type': '小面包车', 'created': '1543849950000', 'from': { 'name': '三里屯' }, 'to': { 'name': '天安门' }, 'fee': 66.66 },
      { 'sender': { 'name': '用户2' }, 'type': '大货车', 'created': '1543849950000', 'from': { 'name': '三里屯' }, 'to': { 'name': '天安门' }, 'fee': 88.88 },
      { 'sender': { 'name': '用户3' }, 'type': '中货车', 'created': '1543849950000', 'from': { 'name': '三里屯' }, 'to': { 'name': '天安门' }, 'fee': 99.99 }
    ];
  }

  ngOnInit() {
    //this.geolocation.getCurrentPosition().then((resp) => {
    //  let positon = new Position()
    //  positon.setLocation(resp.coords.latitude + ',' + resp.coords.longitude);
    this.ordersClient.listByPositon(new Position(), { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: OrderList) => {
        for (var i in response.getItemsList()) {
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
        this.loadDistance();
      });
    // });
  }

  refresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async showUserDetail(order) {
    let localUser = window.localStorage.getItem('user');
    if (!localUser) {
      window.alert('请登录后再接单.');
      return
    }
    const alert = await this.alertController.create({
      header: '确认接单[' + order.sender.name + ']?',
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
            let tsOrder = new Order();
            tsOrder.setId(order.id)
            tsOrder.setStatus('accept');
            tsOrder.setDriverid(JSON.parse(localUser).id);
            this.ordersClient.update(tsOrder, { 'custom-header-1': 'value1' },
              (err: grpcWeb.Error, response: Order) => {
                console.log(response);
              });
          }
        }
      ]
    });
    await alert.present();
  }

  loadDistance() {
    this.geolocation.getCurrentPosition().then(res => {
      for (var order of this.orders) {
        let p1 = ['' + res.coords.longitude, '' + res.coords.latitude]
        console.log('p1', p1);
        let p2 = order.from.location.split(',')
        console.log('p2', p2);
        const dis = AMap.GeometryUtil.distance(p1, p2);
        if (!order.annotations) {
          order.annotations = new Map();
        }
        order.annotations.set('distance', Math.trunc(dis / 1000));
      }
    }).catch(e => {
      console.log(e);
    });
  }
}
