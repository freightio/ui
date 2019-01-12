import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CertificationsClient } from '../../../sdk/user_grpc_web_pb';
import { CertificationList, Certification, UserRequest } from '../../../sdk/user_pb';
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
    let userRequest = new UserRequest();
    userRequest.setId(loginService.getUser().id);
    this.certificationsClient.list(userRequest, {}, (err: grpcWeb.Error, response: CertificationList) => {
      if (err) {
        console.log(err);
      } else {
        for (var i in response.getItemsList()) {
          console.log(i, response.getItemsList()[i])
          let tsCertification = response.getItemsList()[i]
          this.certifications[i] = tsCertification.toObject();
        };
      }
    });
  }

  takePhoto(name: string) {
    let certification = new Certification();
    certification.setUserid(loginService.getUser().id);
    certification.setName(name);
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
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
      // Handle error
      alert(err);
    });
  }
}
