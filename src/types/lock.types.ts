export enum LockType{
  Manual='manual',
  Timer='timer',
}

export interface Lock{
  lock_id : string;
  name : string;
  lock_type : LockType;
  created_by : string;
  created_at : string;
  timeout : string | null;
  description : string;

}

export interface CreateLockRequest{
  timeout : string | null;
  name : string;
  description : string;
  lock_type : LockType;
} 

export interface UpdateLockRequest{
  lock_id : string;
  name : string;
  description : string;
  lock_type: LockType;
  timeout : string | null;
}


export interface Lockfilters{
  lock_name? : string;
  creator_user_name? : string;
  creator_rollno? : string;
  page_number : number;
  page_size : number;

}
