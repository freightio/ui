import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { loginService } from '../../providers/util.service';
import * as grpcWeb from 'grpc-web';
import { Order } from '../../../sdk/order_pb';
import { UserRequest, Verified } from '../../../sdk/user_pb';
import { environment } from '../../../environments/environment';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { CertificationsClient } from '../../../sdk/user_grpc_web_pb';

declare var AMap;

@Component({
  selector: 'app-intinery',
  templateUrl: './intinery.page.html',
  styleUrls: ['./intinery.page.scss'],
})
export class IntineryPage implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  map: any; // 地图对象
  order = loginService.order;
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  certificationsClient = new CertificationsClient(environment.apiUrl, null, null);
  isDisplay = true;

  constructor() { }

  ngOnInit() {
    document.getElementById('detail_order').ontouchmove = (e) => {
      this.hidden();
    };
    this.map = new AMap.Map(this.map_container.nativeElement, {
      view: new AMap.View2D({
        zoom: 11,
        rotateEnable: true,
        // center: [116.2314939, 40.2071555],
        showBuildingBlock: true
      })
    });
    this.map.setMapStyle('amap://styles/light');
    AMap.service('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({});
      //this.map.addControl(geolocation);
    });

    AMap.plugin('AMap.ToolBar', () => {
      var toolbar = new AMap.ToolBar();
      //this.map.addControl(toolbar);
    });

    AMap.plugin('AMap.Driving', () => {
      var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: this.map
      })
      var startLngLat = this.order.from.location.split(','); //[116.379028, 39.865042]
      var endLngLat = this.order.to.location.split(',');//[116.427281, 39.903719]
      driving.search(startLngLat, endLngLat, function (status, result) {
        //console.log(result);
      })

    });
  }

  accept() {
    if (!loginService.getUser().id) {
      alert('请登录!')
      return;
    }
    let userRequest = new UserRequest();
    userRequest.setId(loginService.getUser().id);
    this.certificationsClient.verify(userRequest, {}, (err: grpcWeb.Error, verified: Verified) => {
      if (verified.getResult()) {
        if (window.confirm('确定接单?')) {
          let tsOrder = new Order();
          tsOrder.setId(this.order.id)
          tsOrder.setStatus('accept');
          tsOrder.setDriverid(loginService.getUser().id);
          this.ordersClient.update(tsOrder, { 'custom-header-1': 'value1' },
            (err: grpcWeb.Error, response: Order) => {
              console.log(response);
            });
        }
      } else {
        alert('请认证后再接单！')
      }
    });
  }

  public hidden() {
    this.isDisplay = !this.isDisplay
  }
}
