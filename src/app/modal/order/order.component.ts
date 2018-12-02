import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import { environment } from '../../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { Order, Contact, Position } from '../../../sdk/order_pb';
import { concat } from 'rxjs';

//declare var proto;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order = this.navParams.get('order');
  //from = this.navParams.get('from');
  //to = this.navParams.get('to');
  //fee = this.navParams.get('fee');
  //type = this.navParams.get('type');
  person = { 'name': '', 'tel': '' };
  time: any;

  constructor(
    private navParams: NavParams,
    private contacts: Contacts,
    private modalController: ModalController,
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
          console.log('==', this.order);
          const ordersClient = new OrdersClient(environment.apiUrl, null, null);
          const tsOrder = new Order();
          const contact = new Contact()
          contact.setName(this.person.name);
          contact.setTel(this.person.tel);
          tsOrder.setContact(contact);
          let from = new Position();
          from.setName(this.order.from.name);
          from.setAddress(this.order.from.address);
          tsOrder.setFrom(from);
          let to = new Position();
          to.setName(this.order.tos[0].name);
          to.setAddress(this.order.tos[0].address);
          tsOrder.setTosList([to])
          tsOrder.setType(this.order.type);
          tsOrder.setFee(this.order.fee);
          const call = ordersClient.add(tsOrder, { 'custom-header-1': 'value1' },
            (err: grpcWeb.Error, response: Order) => {
              console.log(err);
              console.log(response);
              this.modalController.dismiss();
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
          // var ordersClient = new proto.backend.OrdersClient(environment.apiUrl);
          // var order = new proto.backend.Order();
          // order.setName('张三');
          // order.setFrom('天安门');
          // order.setType("小面包车");
          // var metadata = { 'custom-header-1': 'value1' };
          // var call = ordersClient.add(order, metadata, function (err, response) {
          //   if (err) {
          //     console.log(err.code);
          //     console.log(err.message);
          //   } else {
          //     console.log(response);
          //   }
          // });
          // call.on('status', function (status) {
          //   console.log(status.code);
          //   console.log(status.details);
          //   console.log(status.metadata);
          // });
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
