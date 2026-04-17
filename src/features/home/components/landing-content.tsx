import { getLandingData } from "@/features/home/data/landing";
import MainContainer from "@/components/layout/MainContainer";

export async function LandingContent() {
  const data = await getLandingData();
  return <MainContainer data={data} />;
}
