import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Ranking } from './../../interface/ranking';
import { RankingService } from './../../service/ranking.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent {
  rs = inject(RankingService);
  us = inject(UserService);
  router=inject(Router);
  translate = inject(TranslateService);
  rankings: Ranking[] = [];

  ngOnInit() {
    this.rs.getRankings().subscribe((data) => {
      this.rankings = data;
      this.rankings.sort((a, b) => b.puntaje - a.puntaje);
    });
  }

  navegarMenu()
  {
    this.router.navigate(['/menu']);
  }
  logout()
  {
    this.us.logout();
    this.router.navigate(['']);
  }
}
