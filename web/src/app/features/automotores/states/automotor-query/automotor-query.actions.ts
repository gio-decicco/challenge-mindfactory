import { createAction, props } from "@ngrx/store";
import { AutomotorResponseDto } from "../../models/automotor.response.dto";

export const init = createAction('[Automotor Query Page] Init');

export const getAll = createAction('[Automotor Query Page] Get All Automotores');

export const getAllSuccess = createAction(
    '[Automotor Query Page] Get All Automotores Success', 
    props<{ automotores: AutomotorResponseDto[] }>()
);

export const getAllFailure = createAction(
    '[Automotor Query Page] Get All Automotores Failure', 
    props<{ error: string }>()
);

export const deleteByDominio = createAction(
    '[Automotor Query Page] Delete By Dominio', 
    props<{ dominio: string }>()
);

export const deleteByDominioSuccess = createAction(
    '[Automotor Query Page] Delete By Dominio Success', 
    props<{ dominio: string }>()
);

export const deleteByDominioFailure = createAction(
    '[Automotor Query Page] Delete By Dominio Failure', 
    props<{ error: string }>()
);