import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AutomotoresService } from "../../automotores.service";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import * as AutomotorEditActions from './automotor-edit.actions';

@Injectable()
export class AutomotorEditEffects {

    private readonly actions = inject(Actions);
    private readonly service = inject(AutomotoresService);
    
    update$ = createEffect(() => this.actions.pipe(
        ofType(AutomotorEditActions.update),
        switchMap((action) => this.service.update(action.dominio, action.request).pipe(
            map((response) => AutomotorEditActions.updateSuccess({ response })),
            catchError((error) => {
                const errorMessage = error?.error?.message || error?.message || 'Error al actualizar automotor';
                return of(AutomotorEditActions.updateFailure({ error: errorMessage }));
            })
        ))
    ));

    load$ = createEffect(() => this.actions.pipe(
        ofType(AutomotorEditActions.load),
        switchMap((action) => this.service.getByDominio(action.dominio).pipe(
            map((response) => AutomotorEditActions.loadSuccess({ response })),
            catchError((error) => {
                const errorMessage = error?.error?.message || error?.message || 'Error al cargar automotor';
                return of(AutomotorEditActions.loadFailure({ error: errorMessage }));
            })
        ))
    ));
}