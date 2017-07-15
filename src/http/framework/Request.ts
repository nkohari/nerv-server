import { Credentials } from '../../common';

interface RequestParams {
  agentid: string;
  deviceid: string;
  groupid: string;
  membershipid: string;
  userid: string;
}

export interface Request<TPayload = {}, TQuery = {}, TPrereqs = {}> {
  auth: { credentials: Credentials };
  params: RequestParams;
  payload: TPayload;
  query: TQuery;
  pre: TPrereqs;
}
