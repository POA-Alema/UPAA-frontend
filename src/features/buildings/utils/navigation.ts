const RETURN_TO_PARAM = "returnTo";

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

export function buildBuildingDetailHref(
  slug: string,
  returnTo = "/mapa",
) {
  const normalizedReturnTo = normalizeInternalHref(returnTo);

  if (!normalizedReturnTo) {
    return `/buildings/${slug}`;
  }

  const searchParams = new URLSearchParams({
    [RETURN_TO_PARAM]: normalizedReturnTo,
  });

  return `/buildings/${slug}?${searchParams.toString()}`;
}

export function resolveBuildingBackToMapHref(
  searchParams?: SearchParams,
  fallbackHref = "/mapa",
) {
  const returnTo = searchParams?.returnTo;
  const rawHref = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  const normalizedHref = normalizeInternalHref(rawHref);

  return normalizedHref ?? fallbackHref;
}
