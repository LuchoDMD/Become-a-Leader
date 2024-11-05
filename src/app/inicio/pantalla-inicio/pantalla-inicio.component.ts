import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-inicio',
  standalone: true,
  imports: [],
  templateUrl: './pantalla-inicio.component.html',
  styleUrl: './pantalla-inicio.component.css'
})
export class PantallaInicioComponent implements OnInit{


  route=inject(Router);
  constructor(
    private activatedRoute:ActivatedRoute
  ){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  NavigateToNewPartida()
  {
    this.route.navigate(['nuevaPartida']);
  }
}
