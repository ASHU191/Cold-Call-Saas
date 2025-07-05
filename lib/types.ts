// Type definitions for the cold calling system

export interface CallRequest {
  phoneNumber: string
}

export interface CallResponse {
  success: boolean
  message: string
  callSid?: string
}

export interface TwilioError {
  code: number
  message: string
  moreInfo: string
  status: number
}

export interface TwilioCall {
  sid: string
  accountSid: string
  to: string
  from: string
  status: string
  startTime: string | null
  endTime: string | null
  duration: string | null
  price: string | null
  direction: string
  answeredBy: string | null
  forwardedFrom: string | null
  callerName: string | null
  uri: string
  subresourceUris: {
    notifications: string
    recordings: string
    feedback: string
    events: string
  }
}
