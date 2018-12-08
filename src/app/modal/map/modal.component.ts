import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var AMap;

@Component({
  selector: 'app-model',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  iframe: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController) {
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl('https://m.amap.com/picker/?key=60d396703bef1a6a93d2eca45a70e764');
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      const cw = this.map_container.nativeElement.contentWindow;
      // this.map_container.nativeElement.onload = function () {
      cw.postMessage('hello', '*');
      // };
      window.addEventListener('message', (e) => {
        console.log(e.data);
        this.modalController.dismiss(e.data);
      }, false);
    }, 2000);
  }

  getLocation() {
    alert('TODO.');
  }
}
