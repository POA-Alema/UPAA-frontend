import { landingMock } from "../mocks/landing-mock";
import type { LandingData } from "../types/landing";

const SIMULATED_DELAY_MS = 800;

export async function getLandingData(): Promise<LandingData> {
  //await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  return landingMock;
}
