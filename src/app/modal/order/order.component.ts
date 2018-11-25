import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import { environment } from '../../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { Order } from '../../../sdk/order_pb';

// import  a= require("../../../sdk/order_pb.js");

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  from = this.navParams.get('from');
  to = this.navParams.get('to');
  fee = this.navParams.get('fee');
  type = this.navParams.get('type');
  person = { 'name': '', 'tel': '' };
  time: any;

  constructor(
    private navParams: NavParams,
    private contacts: Contacts,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.time = new Date();
  }

  selectContact() {
    this.contacts.pickContact().then(e => {
      this.person.name = e.displayName;
      this.person.tel = e.phoneNumbers[0].value;
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '支付方式',
      buttons: [{
        text: '余额支付',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: '支付宝',
        icon: 'share',
        handler: () => {
          const ordersClient = new OrdersClient(environment.apiUrl, null, null);
          const order = new Order();
          order.setFrom(this.from.data.name);
          order.setTosList([this.to.data.name])
          order.setName(this.person.name);
          order.setTel(this.person.tel);
          order.setType(this.type);
          order.setFee(this.fee);
          // order.setAnnotationsList([{ "name1": "test1" }, { "name2": "test2" }])
          const call = ordersClient.add(order, { 'custom-header-1': 'value1' },
            (err: grpcWeb.Error, response: Order) => {
              console.log(err);
              console.log(response);
            });
          call.on('status', (status: grpcWeb.Status) => {
            console.log(status); call.on('status', (status: grpcWeb.Status) => {
              console.log(status);
            });
          });
        }
      }, {
        text: '微信',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
