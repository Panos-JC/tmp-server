import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class TrendingService {
  constructor(private httpService: HttpService) {}

  findAll(mediaType: string, timeWindow: string): Observable<AxiosResponse> {
    const media = this.httpService
      .get(
        `${process.env.TMDB_API_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env.TMDB_API_KEY}`,
      )
      .pipe(map((response) => response.data));

    return media;
  }
}
