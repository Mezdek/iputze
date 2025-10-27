import { DefaultMessages, HttpStatus } from '@lib/shared';
import { NextResponse } from 'next/server';

export interface IHttpError {
  status: HttpStatus;
  code: string;
}

export class HttpError extends Error implements IHttpError {
  readonly status: HttpStatus;
  readonly code: string;

  constructor(
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message?: string,
    code?: string
  ) {
    super(message ?? DefaultMessages[status]);
    this.status = status;
    this.code = code ?? HttpStatus[status];
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  json() {
    const errorObj: Record<string, unknown> = {
      code: this.code,
      message: this.message,
      status: this.status,
    };
    if (process.env.NODE_ENV === 'development' && this.stack) {
      errorObj['stack'] = this.stack;
    }
    return errorObj;
  }

  nextResponse() {
    return NextResponse.json(this.json(), { status: this.status });
  }
}
