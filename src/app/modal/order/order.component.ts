import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import { environment } from '../../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { Account } from '../../../sdk/wallet_pb';
import { loginService } from '../../providers/util.service';
import { WalletsClient } from '../../../sdk/wallet_grpc_web_pb';
import { OrdersClient } from '../../../sdk/order_grpc_web_pb';
import { Order, Position, Sender, SignReply, PayInfo } from '../../../sdk/order_pb';

declare let cordova;
declare var proto;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order = this.navParams.get('order');
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  walletsClient = new WalletsClient(environment.apiUrl, null, null);

  constructor(
    private navParams: NavParams,
    private contacts: Contacts,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    let created = new Date();
    created.setMinutes(created.getMinutes() + 5);
    this.order.created = created.getTime();
    this.order.sender = new proto.backend.Sender();
  }

  selectContact() {
    this.contacts.pickContact().then(e => {
      this.order.sender.name = e.displayName;
      this.order.sender.tel = e.phoneNumbers[0].value;
    });
  }

  async presentActionSheet() {
    if (!this.order.sender.name || !this.order.sender.tel) {
      window.alert('请填写订单联系人与电话!');
      return
    }
    const actionSheet = await this.actionSheetController.create({
      header: '支付方式',
      buttons: [{
        text: '余额支付',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          if (window.confirm('确定余额支付?')) {
            let account = new Account();
            account.setFee(-this.order.fee);
            //account.setOrderid(order.id);
            account.setUserid(loginService.getUser().id);
            this.walletsClient.add(account, {}, (err: grpcWeb.Error, response: Account) => {
              console.log(response);
              let payInfo = new PayInfo();
              payInfo.setType('walletpay');
              payInfo.setPayresult(JSON.stringify(response));
              this.saveToDB(payInfo);
            })
          }
        }
      }, {
        text: '支付宝',
        icon: 'share',
        handler: () => {
          console.log('==', this.order);
          this.goToAlipay();
        }
      }, {
        text: '微信',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
          alert('即将支持!');
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
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  goToAlipay() {
    let tsOrder = new Order();
    tsOrder.setFee(this.order.fee);
    this.ordersClient.signAlipay(tsOrder, { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: SignReply) => {
        if (err) {
          alert(err.message)
        } {
          let payInfo = response.getSigned();
          cordova.plugins.alipay.payment(payInfo, (success) => {
            console.log(success);
            //alert('success:' + JSON.stringify(success));
            let payInfo = new PayInfo();
            payInfo.setType('alipay');
            payInfo.setPayresult(JSON.stringify(success));
            this.saveToDB(payInfo);
          }, (error) => {
            console.log(error);
            alert('error:' + JSON.stringify(error));
          });
        }
      });
  }

  saveToDB(payInfo: PayInfo) {
    const tsOrder = new Order();
    let sender = new Sender()
    sender.setId(loginService.getUser().id);
    sender.setName(this.order.sender.name);
    sender.setTel(this.order.sender.tel);
    tsOrder.setSender(sender);

    let from = new Position();
    from.setName(this.order.from.name);
    from.setLocation(this.order.from.location);
    from.setAddress(this.order.from.address);
    tsOrder.setFrom(from);

    let to = new Position();
    to.setName(this.order.tos[0].name);
    to.setLocation(this.order.tos[0].location);
    to.setAddress(this.order.tos[0].address);
    tsOrder.setTosList([to])
    tsOrder.setType(this.order.type);
    tsOrder.setFee(this.order.fee);
    tsOrder.setCreated(this.order.created);
    tsOrder.setComment(this.order.comment);
    tsOrder.setPayinfo(payInfo);
    this.ordersClient.add(tsOrder, { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: Order) => {
        console.log(err);
        console.log(response);
        this.modalController.dismiss();
      });
  }
}
