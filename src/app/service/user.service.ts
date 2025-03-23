import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Usuario } from "../interface/user.interface";
import { Observable, of } from "rxjs";
import { catchError, tap, map } from 'rxjs/operators';
import { Admin } from "../interface/admin";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  http = inject(HttpClient)
  urlBase = 'http://localhost:3000/usuarios'
  urlAdmin = 'http://localhost:3000/admins'
  private user?: Usuario;
  private admin?: Admin;

  postUser(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlBase, user);
  }

  getUser(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlBase);
  }

  getUserByEmail(email: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.urlBase}?email=${email}`).pipe(
      map(users => (users.length ? users[0] : null)),
      catchError(err => {
        console.error('Error fetching user by email:', err);
        return of(null);
      })
    );
  }

  getUserByID(id: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.urlBase}?id=${id}`).pipe(
      map(users => (users.length ? users[0] : null)),
      catchError(err => {
        console.error('Error fetching user by ID:', err);
        return of(null);
      })
    );
  }

  updateUser(id:string, usuario:Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlBase}/${id}`, usuario);
  }

  login(email: string, password: string): Observable<Usuario | boolean> {
    return this.http.get<Usuario[]>(`${this.urlBase}?email=${email}&password=${password}`).pipe(
      tap(users => {
        if (users.length) {
          this.user = users[0];
          localStorage.setItem('token', this.user.id?.toString() || '');
        }
      }),
      map(users => users.length ? users[0] : false),
      catchError(err => {
        console.error('Login error', err);
        return of(false);
      })
    );
  }

  loginAdmin(email: string, password: string): Observable<Admin | boolean> {
    return this.http.get<Admin[]>(`${this.urlAdmin}?email=${email}&password=${password}`).pipe(
      tap(admins => {
        if (admins.length) {
          this.admin = admins[0];
          localStorage.setItem('token', this.admin.id?.toString() || '');
        }
      }),
      map(admins => admins.length ? admins[0] : false),
      catchError(err => {
        console.error('Login error', err);
        return of(false);
      })
    );
  }

  logout(): void {
    this.user = undefined;
    localStorage.removeItem('token');
  }

  logoutAdmin(): void {
    this.admin = undefined;
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  deleteUser(id:string):Observable<void>
  {
    return this.http.delete<void>(this.urlBase+'/'+id);
  }

}
