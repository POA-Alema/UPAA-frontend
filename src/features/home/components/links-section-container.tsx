import { getLinksData } from "../data/links";
import { LinksSectionComponent } from "./links-section";

type LinksSectionProps = {
  lang?: string;
};

export async function LinksSection({ lang = "pt" }: LinksSectionProps = {}) {
  const data = await getLinksData(lang);

  return <LinksSectionComponent data={data} />;
}
