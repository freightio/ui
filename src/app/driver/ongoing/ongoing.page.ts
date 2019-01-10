import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from '../../../sdk/user_pb';
import { Account } from '../../../sdk/wallet_pb';
import { WalletsClient } from '../../../sdk/wallet_grpc_web_pb';
import { environment } from '../../../environments/environment';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { OrderList, Order } from '../../../sdk/order_pb';
import { loginService } from '../../providers/util.service';

declare var startApp;

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.page.html',
  styleUrls: ['./ongoing.page.scss'],
})
export class OngoingPage implements OnInit {
  orders = [];
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  walletsClient = new WalletsClient(environment.apiUrl, null, null);

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    const tsUser = new User();
    tsUser.setId(loginService.getUser().id);
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
        this.orders = this.orders.filter(order => order.status == 'accept');
      });
  }

  async navigate(order: any) {
    const alert = await this.alertController.create({
      header: '开启导航?',
      buttons: [
        {
          text: '取消',
        }, {
          text: '确定',
          handler: data => {
            var endLngLat = order.to.location.split(',');
            let gaodeApp = startApp.set(
              {
                'action': 'ACTION_VIEW',
                'category': 'CATEGORY_DEFAULT',
                'type': 'text/css',
                'package': 'com.autonavi.minimap',
                'uri': 'androidamap://navi?sourceApplication=appname&poiname=' + 'this.item.work_address' + '&lat=' + endLngLat[1] + '&lon=' + endLngLat[0] + '&dev=0',
                'flags': ['FLAG_ACTIVITY_CLEAR_TOP', 'FLAG_ACTIVITY_CLEAR_TASK'],
                'intentstart': 'startActivity',
              }, { /* extras */
                'EXTRA_STREAM': 'extraValue1',
                'extraKey2': 'extraValue2'
              }
            );
            gaodeApp.start()
          }
        }
      ]
    });
    await alert.present();
  }

  async finish(order) {
    if (order.status != 'accept') {
      return
    }
    if (loginService.getUser().id != order.driverid) {
      window.alert('仅司机可确认订单!');
      return
    }
    const alert = await this.alertController.create({
      subHeader: '确认订单[' + order.sender.name + ']已完成?',
      message: '费用[' + order.fee + '元]将打入您的个人钱包中.',
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
            //TODO:put to backend in transaction
            let tsOrder = new Order();
            tsOrder.setId(order.id)
            tsOrder.setStatus('done');
            this.ordersClient.update(tsOrder, { 'custom-header-1': 'value1' },
              (err: grpcWeb.Error, response: Order) => {
                console.log(response);
              });

            let account = new Account();
            account.setFee(order.fee);
            account.setOrderid(order.id);
            account.setUserid(order.driverid);
            this.walletsClient.add(account, {}, (err: grpcWeb.Error, response: Account) => {
              console.log(response);
            })
          }
        }
      ]
    });
    await alert.present();
  }
}
