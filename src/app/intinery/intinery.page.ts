import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

declare var AMap;

@Component({
  selector: 'app-intinery',
  templateUrl: './intinery.page.html',
  styleUrls: ['./intinery.page.scss'],
})
export class IntineryPage implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  map: any; // 地图对象
  order: any;

  constructor() {
    this.order = {};
  }

  ngOnInit() {
    this.map = new AMap.Map(this.map_container.nativeElement, {
      view: new AMap.View2D({
        zoom: 11,
        rotateEnable: true,
        // center: [116.2314939, 40.2071555],
        showBuildingBlock: true
      })
    });
    this.map.setMapStyle("amap://styles/light");
    AMap.service('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({});
      //this.map.addControl(geolocation);
    });

    AMap.plugin('AMap.ToolBar', () => {
      var toolbar = new AMap.ToolBar();
      //this.map.addControl(toolbar);
    });

    AMap.plugin('AMap.Driving', () => {
      var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: this.map
      })

      var startLngLat = [116.379028, 39.865042]
      var endLngLat = [116.2314939, 40.2071555]//[116.427281, 39.903719]

      driving.search(startLngLat, endLngLat, function (status, result) {
        console.log(result);
      })

    });
  }

}
