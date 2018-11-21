import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController } from '@ionic/angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  from = this.navParams.get('from');
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
          console.log('Share clicked');
        }
      }, {
        text: '微信',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      },  {
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
