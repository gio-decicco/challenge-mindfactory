import { createAction, props } from "@ngrx/store";
import { AutomotorResponseDto } from "../../models/automotor.response.dto";
import { AutomotorUpdateDto } from "../../models/automotor.update.dto";

export const init = createAction('[AutomotorEdit] Init');
export const load = createAction('[AutomotorEdit] Load', props<{ dominio: string }>());
export const loadSuccess = createAction('[AutomotorEdit] Load Success', props<{ response: AutomotorResponseDto }>());
export const loadFailure = createAction('[AutomotorEdit] Load Failure', props<{ error: string }>());
export const update = createAction('[AutomotorEdit] Update', props<{ dominio: string, request: AutomotorUpdateDto }>());
export const updateSuccess = createAction('[AutomotorEdit] Update Success', props<{ response: AutomotorResponseDto }>());
export const updateFailure = createAction('[AutomotorEdit] Update Failure', props<{ error: string }>());