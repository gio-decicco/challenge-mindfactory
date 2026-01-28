import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { AutomotorQueryFacade } from "../states/automotor-query/automotor-query.facade";
import { AutomotorResponseDto } from "../models/automotor.response.dto";
import { Subscription } from "rxjs";

@Injectable()
export class AutomotorQueryPageFacadeService implements OnDestroy{

    private readonly facade = inject(AutomotorQueryFacade);

    loading = signal(false);
    automotores = signal<AutomotorResponseDto[]>([]);
    error = signal<string | null>(null);

    subs = new Subscription();

    init(){
        this.subs.add(this.facade.loading$.subscribe(loading => this.loading.set(loading)));
        this.subs.add(this.facade.automotores$.subscribe(automotores => this.automotores.set(automotores)));
        this.subs.add(this.facade.error$.subscribe(error => this.error.set(error)));

        this.facade.init();
        this.facade.getAll();
    }

    ngOnDestroy(): void {
        this.facade.init();
        this.subs.unsubscribe();
    }

    deleteByDominio(dominio: string) {
        this.facade.deleteByDominio(dominio);
    }

    getAll() {
        this.facade.getAll();
    }

}