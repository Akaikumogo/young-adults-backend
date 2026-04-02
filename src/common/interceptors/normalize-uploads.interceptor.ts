import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function stripUploadsDomain(value: unknown): unknown {
  if (typeof value === 'string') {
    if (!value.startsWith('http://') && !value.startsWith('https://')) return value;
    try {
      const url = new URL(value);
      if (url.pathname.startsWith('/uploads/')) return url.pathname;
      return value;
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map(stripUploadsDomain);
  }

  if (value && typeof value === 'object') {
    // Preserve Dates, Buffers, Streams, etc. (best-effort)
    if (value instanceof Date) return value;

    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = stripUploadsDomain(v);
    }
    return out;
  }

  return value;
}

@Injectable()
export class NormalizeUploadsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => stripUploadsDomain(data)));
  }
}

