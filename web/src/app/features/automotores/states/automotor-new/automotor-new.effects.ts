import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AutomotoresService } from "../../automotores.service";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import * as AutomotorNewActions from './automotor-new.actions';

@Injectable()
export class AutomotorNewEffects {

    private readonly actions = inject(Actions);
    private readonly service = inject(AutomotoresService);
    
    create$ = createEffect(() => this.actions.pipe(
        ofType(AutomotorNewActions.create),
        switchMap((action) => this.service.create(action.request).pipe(
            map((response) => AutomotorNewActions.createSuccess({ response })),
            catchError((error) => {
                const errorMessage = error?.error?.message || error?.message || 'Error al crear automotor';
                return of(AutomotorNewActions.createFailure({ error: errorMessage }));
            })
        ))
    ));
}