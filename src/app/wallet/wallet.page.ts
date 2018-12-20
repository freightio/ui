import { Component, OnInit } from '@angular/core';
import * as grpcWeb from 'grpc-web';
import { Account } from '../../sdk/wallet_pb';
import { WalletsClient } from '../../sdk/wallet_grpc_web_pb';
import { environment } from '../../environments/environment';
import { loginService } from '../providers/util.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  account: any;
  walletsClient = new WalletsClient(environment.apiUrl, null, null);

  constructor() {
    this.account = {};
  }

  ngOnInit() {
    let account = new Account();
    account.setUserid(loginService.getUser().id);
    this.walletsClient.total(account, {}, (err: grpcWeb.Error,
      response: Account) => {
      if (err) {
        console.log(err);
      }
      if (response.toObject()) {
        this.account.fee = (<any>response.toObject()).fee.toFixed(2);
      } else {
        this.account.fee = '0.00';
      }
    });
  }

}
