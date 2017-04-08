import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { AuthenticationService } from "app/modules/authentication";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private authService: AuthenticationService) {
    // this.authService.verifyToken();
  }
  toasterconfig: ToasterConfig =
  new ToasterConfig({
    timeout: 3000,
    positionClass: 'toast-top-center',
  });
}
