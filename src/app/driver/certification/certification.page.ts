import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CertificationsClient } from '../../../sdk/user_grpc_web_pb';
import { Certification } from '../../../sdk/user_pb';
import { environment } from '../../../environments/environment';
import { loginService } from '../../providers/util.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.page.html',
  styleUrls: ['./certification.page.scss'],
})
export class CertificationPage implements OnInit {
  certifications = [];
  certificationsClient = new CertificationsClient(environment.apiUrl, null, null);

  constructor(private camera: Camera) { }

  ngOnInit() {
    var i = 0;
    let cert = new Certification();
    cert.setUserid(loginService.getUser().id);
    let stream = this.certificationsClient.list(cert, {});
    stream.on('data', response => {
      this.certifications[i] = response.toObject();
      i++;
    });
  }

  takePhoto(name: string) {
    let certification = new Certification();
    certification.setUserid(loginService.getUser().id);
    certification.setName(name);
    certification.setStatus('new');
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      certification.setImagedata(base64Image);
      this.certificationsClient.add(certification, {}, (err: grpcWeb.Error, response: Certification) => {
        if (err) {
          alert(JSON.stringify(err));
        } else {
          this.ngOnInit();
        }
      });
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }
}
