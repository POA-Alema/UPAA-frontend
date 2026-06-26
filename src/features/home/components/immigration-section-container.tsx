import { getImmigrationData } from "../data/immigration";
import { ImmigrationSectionComponent } from "./immigration-section";

type ImmigrationSectionProps = {
  lang?: string;
};

export async function ImmigrationSection({ lang = "pt" }: ImmigrationSectionProps = {}) {
  const data = await getImmigrationData(lang);

  return <ImmigrationSectionComponent data={data} />;
}
