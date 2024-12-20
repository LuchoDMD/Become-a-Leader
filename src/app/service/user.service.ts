import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Usuario } from "../interface/user.interface";
import { Observable, of} from "rxjs";
import { catchError, tap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  http=inject(HttpClient)
  urlBase='http://localhost:3000/usuarios'
  private user?:Usuario;

  postUser(user: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.urlBase, user);
  }

  getUser():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlBase);
  }

  getUserByEmail(email: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.urlBase}?email=${email}`).pipe(
      map(users => (users.length ? users[0] : null)), // Cambia el resultado a un solo usuario o null
      catchError(err => {
        console.error('Error fetching user by email:', err);
        return of(null); // Devuelve null en caso de error
      })
    );
  }
  
  getUserByID(id: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.urlBase}?id=${id}`).pipe(
      map(users => (users.length ? users[0] : null)), // Cambia el resultado a un solo usuario o null
      catchError(err => {
        console.error('Error fetching user by ID:', err);
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  login(email: string, password: string): Observable<Usuario | boolean> {
    return this.http.get<Usuario[]>(`${this.urlBase}?email=${email}&password=${password}`).pipe(
      tap(users => {
        if (users.length) {
          this.user = users[0];
          localStorage.setItem('token', this.user.id?.toString() || '');
        }
      }),
      map(users => users.length ? users[0] : false), // Devuelve el usuario si existe, o false
      catchError(err => {
        console.error('Login error', err);
        return of(false);
      })
    );
  }
  

  logout():void{
    this.user=undefined;
    localStorage.removeItem('token');
  }

  isLoggedIn():boolean{  // !! no es una negacion de una negacion, transforma el valor en un booleano
    return !!localStorage.getItem('token');
  }
}

