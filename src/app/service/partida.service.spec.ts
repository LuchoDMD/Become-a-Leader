import { TestBed } from '@angular/core/testing';

import { PartidaService } from './partida.service';

describe('PartidaService', () => {
  let service: PartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
