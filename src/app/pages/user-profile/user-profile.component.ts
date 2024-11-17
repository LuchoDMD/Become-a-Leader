import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserAccountInfoComponent } from '../../components/user-account-info/user-account-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserAccountInfoComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  usuario: any;
  verConfigCuenta: boolean = true;
  verInfoPartidas: boolean = true;

  constructor(
    private router: Router,
    private us: UserService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.us.getUserByID(token).subscribe({
        next: (res) => this.usuario = res,
        error: (err) => console.error('Error al obtener el usuario: ' + err + '.')
      });
    }
  }

  onVolver(): void {
    this.verConfigCuenta = true;
    this.verInfoPartidas = true;
  }

  activarConfigCuenta(): void {
    this.verInfoPartidas = false;
    this.verConfigCuenta = true;
  }

  activarInfoPartidas(): void {
    this.verConfigCuenta = false;
    this.verInfoPartidas = true;
  }

  onSalir():void{
    this.router.navigate(['/menu']);
  }
}
