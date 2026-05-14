'use client';

export interface UploadResult {
  fileId: string;
  url: string;
}

export interface UploadError {
  error: string;
  code: 'NO_FILE' | 'TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED';
}

/** Check if upload result is an error */
export function isUploadError(result: UploadResult | UploadError): result is UploadError {
  return 'error' in result;
}
