import { createFeatureSelector, createSelector } from "@ngrx/store";
import { automotoresNewFeatureKey, AutomotorNewState } from "./automotor-new.reducer";

export const selectAutomotorNewState = createFeatureSelector<AutomotorNewState>(automotoresNewFeatureKey);

export const selectAutomotorNewLoading = createSelector(
    selectAutomotorNewState,
    (state) => state.loading
);

export const selectAutomotorNewSaved = createSelector(
    selectAutomotorNewState,
    (state) => state.saved
);

export const selectAutomotorNewError = createSelector(
    selectAutomotorNewState,
    (state) => state.error
);