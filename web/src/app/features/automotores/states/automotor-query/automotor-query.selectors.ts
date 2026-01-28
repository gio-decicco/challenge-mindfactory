import { createFeatureSelector, createSelector } from "@ngrx/store";
import { automotoresQueryFeatureKey, AutomotorQueryState } from "./automotor-query.reducer";

export const selectAutomotorQueryState = createFeatureSelector<AutomotorQueryState>(automotoresQueryFeatureKey);

export const selectAutomotores = createSelector(
    selectAutomotorQueryState,
    (state) => state.automotores
);

export const selectLoading = createSelector(
    selectAutomotorQueryState,
    (state) => state.loading
);

export const selectError = createSelector(
    selectAutomotorQueryState,
    (state) => state.error
);