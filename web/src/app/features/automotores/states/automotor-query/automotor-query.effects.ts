import { inject, Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { AutomotoresService } from "../../automotores.service";
import { createEffect } from "@ngrx/effects";
import { ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import { map } from "rxjs";
import { catchError } from "rxjs";
import { of } from "rxjs";
import * as AutomotorQueryActions from "./automotor-query.actions";

@Injectable()
export class AutomotorQueryEffects {

    private readonly actions$ = inject(Actions);
    private readonly automotoresService = inject(AutomotoresService);

    getAll$ = createEffect(() => this.actions$.pipe(
        ofType(AutomotorQueryActions.getAll),
        switchMap(() => this.automotoresService.getAll().pipe(
            map((automotores) => AutomotorQueryActions.getAllSuccess({ automotores })),
            catchError((error) => of(AutomotorQueryActions.getAllFailure({ error })))
        ))
    ));

    deleteByDominio$ = createEffect(() => this.actions$.pipe(
        ofType(AutomotorQueryActions.deleteByDominio),
        switchMap(({ dominio }) => this.automotoresService.delete(dominio).pipe(
            map(() => AutomotorQueryActions.deleteByDominioSuccess({ dominio })),
            catchError((error) => of(AutomotorQueryActions.deleteByDominioFailure({ error })))
        ))
    ));
}