import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SujetosService } from '../../features/sujetos/sujetos.service';

export function sujetoExistsAsyncValidator(
  sujetosService: SujetosService,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const raw = (control.value ?? '').toString().trim();
    const digits = raw.replace(/\D/g, '');

    // Si está vacío, que lo maneje required.
    if (!digits) return of(null);

    // Si no tiene 11 dígitos, no dispares HTTP (que lo maneje el validator sync).
    if (digits.length !== 11) return of(null);

    // Si el validator sync ya marcó inválido, no dispares HTTP.
    if (control.errors?.['cuitInvalid']) return of(null);

    // Evita pegarle al backend por cada tecla.
    return timer(250).pipe(
      switchMap(() => sujetosService.getByCuit(digits)),
      map(() => null),
      catchError((err) => {
        const status = err?.status;
        if (status === 404) return of({ sujetoNotFound: true });
        return of({ sujetoLookupFailed: true });
      }),
    );
  };
}

