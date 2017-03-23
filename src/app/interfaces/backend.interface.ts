import { IBuilding } from './building.interface';

export interface IBackendBuildingtList {
  data: IBuilding[];
}

export interface IBackendBuildingListPartial {
  data: IBuilding[];
  count: number;
}