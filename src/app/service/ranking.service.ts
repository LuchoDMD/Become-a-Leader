import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ranking } from '../interface/ranking';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  http = inject(HttpClient);
  urlBase = 'http://localhost:3000/rankings';

  constructor() { }

  getRankings(): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(this.urlBase)
  }
  postRanking(ranking: Ranking): Observable<Ranking> {
    return this.http.post<Ranking>(this.urlBase, ranking);
  }
}
