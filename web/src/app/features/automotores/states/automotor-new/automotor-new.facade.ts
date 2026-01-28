import { inject, Injectable, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectAutomotorNewLoading, selectAutomotorNewSaved, selectAutomotorNewError } from "./automotor-new.selectors";
import { AutomotorCreateDto } from "../../models/automotor.create.dto";
import * as AutomotorNewActions from './automotor-new.actions';

@Injectable()
export class AutomotorNewFacade {

    private readonly store = inject(Store);

    loading$ = this.store.select(selectAutomotorNewLoading);
    saved$ = this.store.select(selectAutomotorNewSaved);
    error$ = this.store.select(selectAutomotorNewError);

    init() {
        this.store.dispatch(AutomotorNewActions.init());
    }

    create(request: AutomotorCreateDto) {
        this.store.dispatch(AutomotorNewActions.create({ request }));
    }

}