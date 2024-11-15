import { Component } from '@angular/core';
import { UserAccountInfoComponent } from '../../components/user-account-info/user-account-info.component';
import { UserIngameInfoComponent } from '../../components/user-ingame-info/user-ingame-info.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserAccountInfoComponent, UserIngameInfoComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

}
