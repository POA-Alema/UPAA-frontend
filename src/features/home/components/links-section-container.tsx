import { getLinksData } from "../data/links";
import { LinksSectionComponent } from "./links-section";

export async function LinksSection() {
  const data = await getLinksData();

  return <LinksSectionComponent data={data} />;
}