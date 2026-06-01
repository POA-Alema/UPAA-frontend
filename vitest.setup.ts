import "@testing-library/jest-dom";

import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
console.log("AXE SETUP LOADED");