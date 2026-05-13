import { getImmigrationData } from "../data/immigration";
import { ImmigrationSectionComponent } from "./immigration-section";

export async function ImmigrationSection() {
  const data = await getImmigrationData();

  return <ImmigrationSectionComponent data={data} />;
}
