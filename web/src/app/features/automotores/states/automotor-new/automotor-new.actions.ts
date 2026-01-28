import { createAction, props } from "@ngrx/store";
import { AutomotorCreateDto } from "../../models/automotor.create.dto";
import { AutomotorResponseDto } from "../../models/automotor.response.dto";

export const init = createAction('[AutomotorNew] Init');
export const create = createAction('[AutomotorNew] Create', props<{ request: AutomotorCreateDto }>());
export const createSuccess = createAction('[AutomotorNew] Create Success', props<{ response: AutomotorResponseDto }>());
export const createFailure = createAction('[AutomotorNew] Create Failure', props<{ error: string }>());