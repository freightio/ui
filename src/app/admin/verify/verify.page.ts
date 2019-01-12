import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { CertificationsClient } from '../../../sdk/user_grpc_web_pb';
import { Certification, UserRequest } from '../../../sdk/user_pb';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  certificationsAdmin = [];
  certificationsClient = new CertificationsClient(environment.apiUrl, null, null);

  constructor() { }

  ngOnInit() {
    var j = 0;
    let certAdmin = new Certification();
    certAdmin.setStatus('new');
    let streamAdmin = this.certificationsClient.list(certAdmin, {});
    streamAdmin.on('data', response => {
      this.certificationsAdmin[j] = response.toObject();
      j = j + 1;
    });
  }

  pass(certification: Certification) {
    if (certification.getStatus() == 'new') {
      certification.setStatus('pass');
    } else {
      certification.setStatus('new');
    }
    this.certificationsClient.update(certification, {}, (err: grpcWeb.Error, response: Certification) => {
      if (err) {
        alert(JSON.stringify(err));
      } else {
        this.ngOnInit();
      }
    });
  }
}
