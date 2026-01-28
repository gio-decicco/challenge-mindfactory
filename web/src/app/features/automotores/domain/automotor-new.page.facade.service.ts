import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { AutomotorNewFacade } from "../states/automotor-new/automotor-new.facade";
import { AutomotorCreateDto } from "../models/automotor.create.dto";

@Injectable()
export class AutomotorNewPageFacadeService implements OnDestroy {

    private readonly facade = inject(AutomotorNewFacade);
    subs = new Subscription();

    loading = signal(false);
    saved = signal(false);
    error = signal<string | null>(null);

    // Exponer observables para suscripciones externas
    readonly saved$ = this.facade.saved$;

    init() {
        this.subs.add(this.facade.loading$.subscribe(loading => this.loading.set(loading)));
        this.subs.add(this.facade.saved$.subscribe(saved => this.saved.set(saved)));
        this.subs.add(this.facade.error$.subscribe(error => this.error.set(error)));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    create(request: AutomotorCreateDto) {
        this.facade.create(request);
    }
}