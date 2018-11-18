import { Component, Injector, ViewChild } from '@angular/core';
import { ModalController, Slides } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

declare var AMap;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  showLeftButton = false;
  showRightButton = true;
  currentFreight: any;
  from: any;
  to: any;
  fee: any;
  sliderConfig = {
    slidesPerView: 4,
    effect: 'flip'
  };

  freights = [
    { 'name': '小面包车', 'image': 'assets/img/11.png', 'weight': '800公斤', 'lwh': '1.8*1.2*1.1米', 'cube': '2.4方', 'price': 10 },
    { 'name': '中面包车', 'image': 'assets/img/22.png', 'weight': '1.2吨', 'lwh': '2.8*1.5*1.3米', 'cube': '5.5方', 'price': 10 },
    { 'name': '小货车', 'image': 'assets/img/33.png', 'weight': '1.5吨', 'lwh': '2.1*1.7*1.6米', 'cube': '5.7方', 'price': 10 },
    { 'name': '中货车', 'image': 'assets/img/44.png', 'weight': '1.8吨', 'lwh': '4.2*1.8*1.8米', 'cube': '13.6方', 'price': 10 },
    { 'name': '大货车', 'image': 'assets/img/55.png', 'weight': '7吨', 'lwh': '7.6*2.3*2.5米', 'cube': '43.7方', 'price': 10 }
  ];

  constructor(
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner) {
    this.currentFreight = this.freights[0];
    // this.from = { 'data': { 'name': '起点' } };
    // this.to = { 'data': { 'name': '终点' } };
  }

  // Method executed when the slides are changed
  public slideChanged(): void {
    this.slides.getActiveIndex().then(e => {
      this.showLeftButton = e !== 0;
    });
    this.slides.length().then(e => {
      this.showRightButton = e !== Math.ceil(e / 4);
    });
  }

  // Method that shows the next slide
  public slideNext(): void {
    this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
    this.slides.slidePrev();
  }

  itemClick(freight) {
    this.currentFreight = freight;
  }

  async presentFromModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    this.from = result;
  }

  async presentToModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    this.to = result;
    this.computeFee();
  }

  computeFee() {
    if (this.from.data && this.to.data) {
      const p1 = this.from.data.location.split(',');
      const p2 = this.to.data.location.split(',');
      // 返回 p1 到 p2 间的地面距离，单位：米
      const dis = AMap.GeometryUtil.distance(p1, p2);
      this.fee = dis * this.currentFreight.price / 1000;
    }
  }

  scanQR() {
    const options: BarcodeScannerOptions = {
      showTorchButton: true, // iOS and Android
    };
    this.barcodeScanner.scan(options).then(barcodeData => {
      // console.log('Barcode data', barcodeData);
      alert(barcodeData.text);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  beginNow() {
    alert('正在开发中.');
  }
}
