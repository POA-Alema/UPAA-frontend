type SearchParamValue = string | string[] | undefined;

type SearchParams = {
  returnTo?: SearchParamValue;
};

function normalizeInternalHref(href: string | undefined) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) {
    return undefined;
  }

  return href;
}

export function resolveArchitectBackToMapHref(
  searchParams?: SearchParams,
  fallbackHref = "/mapa",
) {
  const returnTo = searchParams?.returnTo;
  const rawHref = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  const normalizedHref = normalizeInternalHref(rawHref);

  return normalizedHref ?? fallbackHref;
}