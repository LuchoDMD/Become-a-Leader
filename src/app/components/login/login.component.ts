import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from './../../interface/user.interface';
import { Component, Output, EventEmitter, Inject, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  ngOnInit(): void {
    this.Login()
  }

  @Output()
  emitirUsuarioLogin= new EventEmitter<Usuario>();

  loginError:String | null=null;

  us=inject(UserService)
  fb=inject(FormBuilder);
  router=inject(Router);

  loginForm=this.fb.nonNullable.group({
    email:['',[Validators.required,Validators.email]],
    password: ['',[Validators.required]]
  })



  Login()
  {
    if(this.loginForm.valid)
    {
      const {email,password}= this.loginForm.getRawValue()
      this.us.login(email,password).subscribe((user:Usuario | boolean)=>{
        if(user)
        {
          console.log('Login successful:', user);
          this.router.navigate(['Partida'])
        }else{
          console.log('Login failed')
        }
      })
    }
  }

}
