import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from './../../interface/user.interface';
import { Component, Output, EventEmitter, Inject, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Admin } from '../../interface/admin';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  as = inject(AuthService);
  us = inject(UserService)
  fb = inject(FormBuilder);
  router = inject(Router);
  mensaje: string = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  translate = inject(TranslateService);
  @Output()
  emitirUsuarioLogin = new EventEmitter<Usuario>();

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
      this.us.loginAdmin(email, password).subscribe(
        (admin: Admin | boolean) => {
          if (admin) {
            this.as.login();
            console.log('Login successful:', admin);
            this.router.navigate(['add-pokemon']);
          } else {
            this.translate.get('alerts.incorrectCredentials').subscribe(translation => {
              this.mensaje = translation;
            });
            console.log('Login failed')
          }
        },
        (error) => {
          this.translate.get('alerts.loginApiError').subscribe(translation => {
            this.mensaje = translation;
          });
          console.log('Error en el login:', error);
        }
      )
    }
  }


}
