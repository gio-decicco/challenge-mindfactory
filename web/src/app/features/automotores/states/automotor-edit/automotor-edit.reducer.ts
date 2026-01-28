import { createReducer, on } from "@ngrx/store";
import * as AutomotorEditActions from './automotor-edit.actions';
import { AutomotorResponseDto } from "../../models/automotor.response.dto";

export const automotoresEditFeatureKey = 'automotores-edit-state';

export interface AutomotorEditState {
    loading: boolean;
    saved: boolean;
    error: string | null;
    automotor: AutomotorResponseDto | null;
};

const initialState: AutomotorEditState = {
    loading: false,
    saved: false,
    error: null,
    automotor: null,
};
export const automotorEditReducer = createReducer(
    initialState,
    on(AutomotorEditActions.init, () => initialState),
    on(AutomotorEditActions.load, (state) => ({ ...state, loading: true, error: null })),
    on(AutomotorEditActions.loadSuccess, (state, { response }) => ({ ...state, loading: false, automotor: response, error: null })),
    on(AutomotorEditActions.loadFailure, (state, { error }) => ({ 
        ...state, 
        error,
        loading: false, 
    })),
    on(AutomotorEditActions.update, (state) => ({ ...state, loading: true, saved: false, error: null })),
    on(AutomotorEditActions.updateSuccess, (state, { response }) => ({ ...state, loading: false, automotor: response, saved: true, error: null })),
    on(AutomotorEditActions.updateFailure, (state, { error }) => ({ 
        ...state, 
        error,
        loading: false, 
        saved: false
    }))
);