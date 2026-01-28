import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AutomotorResponseDto } from './models/automotor.response.dto';
import { Observable } from 'rxjs';
import { AutomotorCreateDto } from './models/automotor.create.dto';
import { AutomotorUpdateDto } from './models/automotor.update.dto';

@Injectable()
export class AutomotoresService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly endpoint = `${this.apiUrl}/automotores`;


    getAll(): Observable<AutomotorResponseDto[]> {
        return this.http.get<AutomotorResponseDto[]>(this.endpoint);
    }

    getByDominio(dominio: string): Observable<AutomotorResponseDto> {
        return this.http.get<AutomotorResponseDto>(`${this.endpoint}/${dominio}`);
    }

    create(automotor: AutomotorCreateDto): Observable<AutomotorResponseDto> {
        return this.http.post<AutomotorResponseDto>(this.endpoint, automotor);
    }

    update(dominio: string, automotor: AutomotorUpdateDto): Observable<AutomotorResponseDto> {
        return this.http.put<AutomotorResponseDto>(`${this.endpoint}/${dominio}`, automotor);
    }

    delete(dominio: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}/${dominio}`);
    }
  
}
