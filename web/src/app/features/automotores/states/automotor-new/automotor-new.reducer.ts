import { createReducer, on } from "@ngrx/store";
import * as AutomotorNewActions from './automotor-new.actions';

export const automotoresNewFeatureKey = 'automotores-new-state';

export interface AutomotorNewState {
    loading: boolean;
    saved: boolean;
    error: string | null;
};

const initialState: AutomotorNewState = {
    loading: false,
    saved: false,
    error: null,
};
export const automotorNewReducer = createReducer(
    initialState,
    on(AutomotorNewActions.init, () => initialState),
    on(AutomotorNewActions.create, (state) => ({ ...state, loading: true, saved: false, error: null })),
    on(AutomotorNewActions.createSuccess, (state) => ({ ...state, loading: false, saved: true, error: null })),
    on(AutomotorNewActions.createFailure, (state, { error }) => ({ 
        ...state, 
        error,
        loading: false, 
        saved: false 
    })),
);