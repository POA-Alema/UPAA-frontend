import { getLandingData } from "@/features/home/data/landing";
import MainContainer from "@/components/layout/MainContainer";

type LandingContentProps = {
  lang?: string;
};

export async function LandingContent({ lang }: LandingContentProps) {
  const data = await getLandingData(lang);
  return <MainContainer data={data} />;
}
