import { landingMock } from "../mocks/landing-mock";
import type { LandingData } from "../types/landing";

export async function getLandingData(): Promise<LandingData> {
  return landingMock;
}
