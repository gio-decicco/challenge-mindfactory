import { inject, Injectable, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectAutomotorEditLoading, selectAutomotorEditSaved, selectAutomotorEditError, selectAutomotorEditAutomotor } from "./automotor-edit.selectors";
import { AutomotorUpdateDto } from "../../models/automotor.update.dto";
import * as AutomotorEditActions from './automotor-edit.actions';

@Injectable()
export class AutomotorEditFacade {

    private readonly store = inject(Store);

    loading$ = this.store.select(selectAutomotorEditLoading);
    saved$ = this.store.select(selectAutomotorEditSaved);
    error$ = this.store.select(selectAutomotorEditError);
    automotor$ = this.store.select(selectAutomotorEditAutomotor);

    init() {
            this.store.dispatch(AutomotorEditActions.init());
    }

    load(dominio: string) {
        this.store.dispatch(AutomotorEditActions.load({ dominio }));
    }

    update(dominio: string, request: AutomotorUpdateDto) {
        this.store.dispatch(AutomotorEditActions.update({ dominio, request }));
    }

}