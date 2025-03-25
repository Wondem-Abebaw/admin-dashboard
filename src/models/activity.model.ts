import { Staff } from './staff.model';

export interface Activity {
  id: string;
  modelId: string;
  modelName: string;
  userId: string;
  action: string;
  ip: string;
  oldPayload: any;
  payload: any;
  user: Staff;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  deletedBy: string;
}
