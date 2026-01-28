import { Store } from "@ngrx/store";
import { inject, Injectable } from "@angular/core";
import * as AutomotorQuerySelectors from "./automotor-query.selectors";
import * as AutomotorQueryActions from "./automotor-query.actions";

@Injectable()
export class AutomotorQueryFacade {

    private store = inject(Store);
    
    loading$ = this.store.select(AutomotorQuerySelectors.selectLoading);
    error$ = this.store.select(AutomotorQuerySelectors.selectError);
    automotores$ = this.store.select(AutomotorQuerySelectors.selectAutomotores);

    init() { this.store.dispatch(AutomotorQueryActions.init()); }
    
    getAll() { this.store.dispatch(AutomotorQueryActions.getAll()); }

    deleteByDominio(dominio: string) { this.store.dispatch(AutomotorQueryActions.deleteByDominio({ dominio })); }
}