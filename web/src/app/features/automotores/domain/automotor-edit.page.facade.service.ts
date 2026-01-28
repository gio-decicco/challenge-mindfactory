import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { AutomotorEditFacade } from "../states/automotor-edit/automotor-edit.facade";
import { Subscription } from "rxjs";
import { AutomotorResponseDto } from "../models/automotor.response.dto";
import { AutomotorUpdateDto } from "../models/automotor.update.dto";

@Injectable()
export class AutomotorEditPageFacadeService implements OnDestroy {

    private readonly facade = inject(AutomotorEditFacade);
    subs = new Subscription();

    loading = signal(false);
    saved = signal(false);
    error = signal<string | null>(null);
    automotor = signal<AutomotorResponseDto | null>(null);

    readonly saved$ = this.facade.saved$;
    readonly automotor$ = this.facade.automotor$;

    init() {
        this.subs.add(this.facade.loading$.subscribe(loading => this.loading.set(loading)));
        this.subs.add(this.facade.saved$.subscribe(saved => this.saved.set(saved)));
        this.subs.add(this.facade.error$.subscribe(error => this.error.set(error)));
        this.subs.add(this.facade.automotor$.subscribe(automotor => this.automotor.set(automotor)));
        this.facade.init();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    load(dominio: string) {
        this.facade.load(dominio);
    }

    update(dominio: string, request: AutomotorUpdateDto) {
        this.facade.update(dominio, request);
    }
}