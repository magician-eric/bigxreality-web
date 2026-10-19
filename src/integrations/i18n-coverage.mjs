import { fileURLToPath } from "node:url";
import { i18nCoverage, formatCoverage } from "../../scripts/lib/i18n-coverage.mjs";

/** Prints missing-language warnings at the start of every build. Never fails the build. */
export default function i18nCoverageIntegration() {
  let root;
  return {
    name: "bxr:i18n-coverage",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = fileURLToPath(config.root);
      },
      "astro:build:start": async ({ logger }) => {
        const lines = formatCoverage(await i18nCoverage(root));
        if (!lines.length) logger.info("every slug exists in en, tw and jp");
        for (const l of lines) logger.warn(l);
      },
    },
  };
}
