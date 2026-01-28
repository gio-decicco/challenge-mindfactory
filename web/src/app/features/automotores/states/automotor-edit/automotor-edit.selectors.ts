import { createFeatureSelector, createSelector } from "@ngrx/store";
import { automotoresEditFeatureKey, AutomotorEditState } from "./automotor-edit.reducer";

export const selectAutomotorEditState = createFeatureSelector<AutomotorEditState>(automotoresEditFeatureKey);

export const selectAutomotorEditLoading = createSelector(
    selectAutomotorEditState,
    (state) => state.loading
);

export const selectAutomotorEditSaved = createSelector(
    selectAutomotorEditState,
    (state) => state.saved
);

export const selectAutomotorEditError = createSelector(
    selectAutomotorEditState,
    (state) => state.error
);

export const selectAutomotorEditAutomotor = createSelector(
    selectAutomotorEditState,
    (state) => state.automotor
);