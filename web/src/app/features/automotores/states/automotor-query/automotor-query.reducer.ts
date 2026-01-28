import { createReducer, on } from "@ngrx/store";
import { AutomotorResponseDto } from "../../models/automotor.response.dto";
import * as AutomotorQueryActions from './automotor-query.actions';	

export const automotoresQueryFeatureKey = 'automotores-query-state';

export interface AutomotorQueryState {
    automotores: AutomotorResponseDto[];
    loading: boolean;
    error: string | null;
};

const initialState: AutomotorQueryState = {
    automotores: [],
    loading: false,
    error: null,
};

export const automotorQueryReducer = createReducer(
    initialState,
    on(AutomotorQueryActions.getAll, (state) => ({ ...state, loading: true })),
    on(AutomotorQueryActions.getAllSuccess, (state, { automotores }) => ({ ...state, automotores, loading: false })),
    on(AutomotorQueryActions.getAllFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(AutomotorQueryActions.deleteByDominio, (state) => ({ ...state, loading: true })),
    on(AutomotorQueryActions.deleteByDominioSuccess, (state, { dominio }) => ({ ...state, automotores: state.automotores.filter(automotor => automotor.dominio !== dominio), loading: false })),
    on(AutomotorQueryActions.deleteByDominioFailure, (state, { error }) => ({ ...state, error, loading: false })),
);