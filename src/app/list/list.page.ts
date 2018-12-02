import * as grpcWeb from 'grpc-web';
import { GreeterClient } from '../../sdk/helloworld_grpc_web_pb';
import { HelloRequest, HelloReply } from '../../sdk/helloworld_pb';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor() {
    for (let i = 1; i < 6; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }

    const client = new GreeterClient(environment.apiUrl, null, null);
    console.log(client);
    const request = new HelloRequest()
    request.setName("super-man");
    const call = client.sayHello(request, { 'custom-header-1': 'value1' },
      (err: grpcWeb.Error, response: HelloReply) => {
        console.log(response.getMessage());
      });
    call.on('status', (status: grpcWeb.Status) => {
      console.log(status);
    });
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
