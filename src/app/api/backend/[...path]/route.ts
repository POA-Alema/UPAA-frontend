import type { NextRequest } from 'next/server';

const DEFAULT_BACKEND_API_URL = 'http://localhost:3001';
const BODYLESS_METHODS = new Set(['GET', 'HEAD']);
const REQUEST_HEADERS_TO_DROP = [
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];
const RESPONSE_HEADERS_TO_DROP = [
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

type ProxyContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function getBackendApiUrl(): string {
  const configuredUrl =
    process.env.BACKEND_API_URL ??
    process.env.SERVER_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_BACKEND_API_URL;

  return isAbsoluteUrl(configuredUrl)
    ? trimTrailingSlash(configuredUrl)
    : DEFAULT_BACKEND_API_URL;
}

function buildTargetUrl(pathSegments: string[] | undefined, search: string): string {
  const pathname = (pathSegments ?? []).map(encodeURIComponent).join('/');
  return `${getBackendApiUrl()}/${pathname}${search}`;
}

function filterHeaders(headers: Headers, namesToDrop: string[]): Headers {
  const filteredHeaders = new Headers(headers);

  for (const name of namesToDrop) {
    filteredHeaders.delete(name);
  }

  return filteredHeaders;
}

async function proxy(request: NextRequest, context: ProxyContext): Promise<Response> {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.search);
  const headers = filterHeaders(request.headers, REQUEST_HEADERS_TO_DROP);
  const body = BODYLESS_METHODS.has(request.method)
    ? undefined
    : await request.arrayBuffer();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: filterHeaders(response.headers, RESPONSE_HEADERS_TO_DROP),
  });
}

export const dynamic = 'force-dynamic';

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
