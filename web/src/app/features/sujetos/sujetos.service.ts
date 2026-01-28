import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateSujetoDto } from './models/create-sujeto.dto';
import { SujetoDto } from './models/sujeto.dto';

@Injectable()
export class SujetosService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly endpoint = `${this.apiUrl}/sujetos`;
    
    create(sujeto: CreateSujetoDto): Observable<SujetoDto> {
        return this.http.post<SujetoDto>(this.endpoint, sujeto);
    }

    getByCuit(cuit: string): Observable<SujetoDto> {
        return this.http.get<SujetoDto>(`${this.endpoint}/by-cuit?cuit=${cuit}`);
    }

}
