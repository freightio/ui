import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../../environments/environment';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { Position } from '../../../sdk/order_pb';
import { loginService } from '../../providers/util.service';

//declare var proto;
declare var AMap;

@Component({
  selector: 'app-grab',
  templateUrl: './grab.page.html',
  styleUrls: ['./grab.page.scss'],
})
export class GrabPage implements OnInit {
  orders = [];
  ordersClient = new OrdersClient(environment.apiUrl, null, null);

  constructor(
    private router: Router,
    private geolocation: Geolocation,
  ) { }

  ngOnInit() {
    var i = 0;
    this.geolocation.getCurrentPosition().then((resp) => {
      let positon = new Position()
      positon.setLocation(resp.coords.latitude + ',' + resp.coords.longitude);
      let stream = this.ordersClient.listByPositon(positon, {});
      stream.on('data', response => {
        this.orders[i] = response.toObject();
        if (response.getSender() != null) {
          this.orders[i].sender = response.getSender().toObject();
        }
        if (response.getFrom() != null) {
          this.orders[i].from = response.getFrom().toObject();
        }
        if (response.getTosList()[0] != null) {
          this.orders[i].to = response.getTosList()[0].toObject();
        }
        this.orders[i].fee = response.getFee().toFixed(2);
        this.loadDistance(this.orders[i]);
        i++;
      });
      stream.on('error', err => {
        console.log(err);
        this.ngOnInit();
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

  loadDistance(order) {
    this.geolocation.getCurrentPosition().then(res => {
      let p1 = ['' + res.coords.longitude, '' + res.coords.latitude]
      let p2 = order.from.location.split(',')
      const dis = AMap.GeometryUtil.distance(p1, p2);
      if (!order.annotations) {
        order.annotations = new Map();
      }
      order.annotations.set('distance', Math.trunc(dis / 1000));
    }).catch(e => {
      console.log(e);
    });
  }
}
