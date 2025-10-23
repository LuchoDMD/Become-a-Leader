import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from './../../interface/user.interface';
import { Component, Output, EventEmitter, Inject, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  translate = inject(TranslateService);
  as = inject(AuthService);
  us = inject(UserService)
  fb = inject(FormBuilder);
  router = inject(Router);
  mensaje: string = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.route.queryParams.subscribe(params => {
      if (params['mensaje']) {
        this.mensaje = params['mensaje'];
        console.log(this.mensaje);
        this.cdr.detectChanges();  // Actualiza la detección de cambios
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.as.isAuthenticated();
  }

  ngOnInit(): void {
    this.Login()
  }

  Login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue()
      this.us.login(email, password).subscribe(
        (user: Usuario | boolean) => {
          if (user) {
            this.as.login();
            console.log('Login successful:', user);
            this.router.navigate(['Partida'])
          } else {
            this.translate.get('alerts.incorrectCredentials').subscribe(translation => {
              this.mensaje = translation; 
            })
            console.log('Login failed');
          }
        },
        (error) => {
          this.translate.get('alerts.loginApiError').subscribe(translation => {
            this.mensaje = translation; 
          });
          console.log('Login error:', error); 
        }
      )
    }
  }

}
