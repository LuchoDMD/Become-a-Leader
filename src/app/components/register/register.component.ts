import { inject } from '@angular/core';
import { Usuario } from './../../interface/user.interface';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {


  @Output()
  emitirUsuario=new EventEmitter<Usuario>();

  fb=inject(FormBuilder);

    formUsuario=this.fb.nonNullable.group({
      email:['',[Validators.required]],
      nick: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      password: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
    })

    usuarioService= inject(UserService);
    router=inject(Router);
/*
    addUser()
    {
      if (this.formUsuario.invalid)
        {
          return
        }

      const user = this.formUsuario.getRawValue();//Obtiene los datos del formulario con el metodo getRawValue

      this.usuarioService.getUserByEmail(user.email).subscribe({
        next:(user: Usuario | null)=>{
          alert('Este email ya esta registrado')
        }, error: (e: Error)=>{
          this.emitirUsuario.emit(user);  //Emite el evento con los datos del usuario

          this.altaBD(user); //Envia los datos a la base de datos con el metodo altaDB

          this.formUsuario.reset({ //Resetea el formulario
            email: '',
            nick: '',
            password: ''
          });
        }
      },error=>{
        console.error('Error al verificar el email:', error)
      }
    )
    }
*/

addUser() {
  if (this.formUsuario.invalid) {
    return;
  }

  const user = this.formUsuario.getRawValue();

  this.usuarioService.getUserByEmail(user.email).subscribe({
    next: (existingUser: Usuario | null) => {
      console.log(existingUser);
      if (existingUser) {
        alert('Este email ya está registrado');
      } else {
        console.log(user);
        this.emitirUsuario.emit(user);  // Emitir el evento con los datos del usuario
        this.altaBD(user); // Enviar los datos a la base de datos

        this.formUsuario.reset({ // Resetear el formulario
          email: '',
          nick: '',
          password: ''
        });
      }
    },
    error: (error: Error) => {
      console.error('Error al verificar el email:', error);
    }
  });
}
    altaBD(user: Usuario)
    {
      this.usuarioService.postUser(user).subscribe( //Utiliza los datos del usuarioService para subir los datos a la base de datos
        { //Si se agrega el usuario muestra una alerta con el nombre del usuario agregado, sino no.
          next:(user)=>
          {
            alert(`${user.nick} Se ha registrado correctamente :)`)
            this.router.navigate(['']);
          },
          error:(err: Error)=>
          {
            console.log(err.message)
          }
        }
      )
    }
}
