export interface Alert {
  text: string;
  severity?: string;
  raisedAt?: number;
}

export interface AlertState {
  alerts: Alert[]  ;
}

export interface AlertPayload {
  text: string;
  severity?: string
}

