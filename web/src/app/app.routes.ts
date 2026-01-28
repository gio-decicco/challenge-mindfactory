import { Routes } from '@angular/router';
import { Welcome } from './shared/components/welcome/welcome';
import { AutomotoresQuery } from './features/automotores/components/automotores-query/automotores-query';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { automotoresQueryFeatureKey, automotorQueryReducer } from './features/automotores/states/automotor-query/automotor-query.reducer';
import { AutomotorQueryEffects } from './features/automotores/states/automotor-query/automotor-query.effects';
import { AutomotoresService } from './features/automotores/automotores.service';
import { AutomotoresNew } from './features/automotores/components/automotores-new/automotores-new';
import { AutomotorQueryFacade } from './features/automotores/states/automotor-query/automotor-query.facade';
import { AutomotorNewFacade } from './features/automotores/states/automotor-new/automotor-new.facade';
import { automotoresNewFeatureKey, automotorNewReducer } from './features/automotores/states/automotor-new/automotor-new.reducer';
import { AutomotorNewEffects } from './features/automotores/states/automotor-new/automotor-new.effects';
import { AutomotoresEdit } from './features/automotores/components/automotores-edit/automotores-edit';
import { automotorEditReducer, automotoresEditFeatureKey } from './features/automotores/states/automotor-edit/automotor-edit.reducer';
import { AutomotorEditFacade } from './features/automotores/states/automotor-edit/automotor-edit.facade';
import { AutomotorEditEffects } from './features/automotores/states/automotor-edit/automotor-edit.effects';
import { SujetosService } from './features/sujetos/sujetos.service';

export const routes: Routes = [
    {
        path: '',
        component: Welcome
    },
    {
        path: 'automotores',
        providers: [
            AutomotoresService
        ],
        children: [
            { 
                path: '', component: AutomotoresQuery, 
                providers: [
                    AutomotorQueryFacade,
                    provideState({ name: automotoresQueryFeatureKey, reducer: automotorQueryReducer }),
                    provideEffects(AutomotorQueryEffects)
                ] 
            },
            { 
                path: 'new', 
                component: AutomotoresNew, 
                providers: [
                    AutomotorNewFacade,
                    SujetosService,
                    provideState({ name: automotoresNewFeatureKey, reducer: automotorNewReducer }),
                    provideEffects(AutomotorNewEffects)
                ] 
            },
            { 
                path: ':dominio', 
                component: AutomotoresEdit,
                providers: [
                    AutomotorEditFacade,
                    SujetosService,
                    provideState({ name: automotoresEditFeatureKey, reducer: automotorEditReducer }),
                    provideEffects(AutomotorEditEffects)
                ]
            }
        ]
    }
];
