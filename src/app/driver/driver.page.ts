import * as grpcWeb from 'grpc-web';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { OrderList, Position } from '../../sdk/order_pb';
import { loginService } from '../providers/util.service';

//declare var proto;
declare var AMap;

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  orders = [];
  ordersClient = new OrdersClient(environment.apiUrl, null, null);

  constructor(
    private router: Router,
    private geolocation: Geolocation,
  ) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let positon = new Position()
      positon.setLocation(resp.coords.latitude + ',' + resp.coords.longitude);
      this.ordersClient.listByPositon(positon, { 'custom-header-1': 'value1' },
        (err: grpcWeb.Error, response: OrderList) => {
          if (err) {
            this.ngOnInit();
          }
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
    });
  }

  refresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async showUserDetail(order) {
    loginService.order = order;
    this.router.navigateByUrl('/intinery');
  }

  loadDistance() {
    this.geolocation.getCurrentPosition().then(res => {
      for (var order of this.orders) {
        let p1 = ['' + res.coords.longitude, '' + res.coords.latitude]
        // console.log('p1', p1);
        let p2 = order.from.location.split(',')
        // console.log('p2', p2);
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
