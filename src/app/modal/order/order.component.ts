import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  from = this.navParams.get('from');
  person: any;
  constructor(
    private navParams: NavParams,
    private contacts: Contacts) { }

  ngOnInit() {
  }

  selectContact() {
    this.contacts.pickContact().then(e => {
      this.person.name = e.name;
      this.person.tel = e.phoneNumbers[0];
    });
  }
}
