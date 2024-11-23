import { Storage } from "@plasmohq/storage";
import { parseDate } from "chrono-node";
import type { PlasmoCSConfig } from "plasmo";
import type { UserPreferences } from "./types/types";
import { DEFAULT_PREFERENCES } from "./types/types";

export const config: PlasmoCSConfig = {
	matches: ["https://github.com/*"],
};

const storage = new Storage();

window.addEventListener("load", async () => {
	console.log("DOMContentLoaded");

	async function getPreferences(): Promise<UserPreferences> {
		const prefs = await storage.get("preferences");
		return prefs ? JSON.parse(prefs) : DEFAULT_PREFERENCES;
	}

	function createKeyframeStyle(prefs: UserPreferences) {
		// TODO: update the animation to animate each character at a time - problem here is that GH changes the text content of the span with a custom element and i'm not totally sure how to access the inner text of that
		const style = document.createElement("style");
		style.id = "color-wave-keyframes";
		style.textContent = `
			@keyframes colorWave {
				0% { color: inherit; text-shadow: 0 0 0 transparent; }
				15% { color: ${prefs.highlightColor}; text-shadow: 0 0 8px ${prefs.highlightColor}80; }
				30% { color: ${prefs.highlightColor}; text-shadow: 0 0 15px ${prefs.highlightColor}80; }
				45% { color: ${prefs.highlightColor}; text-shadow: 0 0 8px ${prefs.highlightColor}80; }
				60% { color: ${prefs.highlightColor}; text-shadow: 0 0 15px ${prefs.highlightColor}80; }
				100% { color: ${prefs.highlightColor}; text-shadow: 0 0 0 transparent; }
			}
		`;
		return style;
	}

	async function checkAndHighlightRelevantTags(
		retryIn: number | undefined = undefined,
	) {
		const prefs = await getPreferences();
		const relevantTimeTags = document.querySelectorAll<HTMLElement>(
			".react-directory-commit-age",
		);

		for (const tag of relevantTimeTags) {
			const dateText = tag.textContent?.trim() ?? tag.innerText;
			const parsedDate = parseDate(dateText);
			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

			if (parsedDate && parsedDate > threeDaysAgo) {
				tag.style.animation = "colorWave 2s ease forwards";
				if (!document.querySelector("#color-wave-keyframes")) {
					const style = createKeyframeStyle(prefs);
					document.head.appendChild(style);
				}
			}
		}
		if (!relevantTimeTags.length && retryIn) {
			setTimeout(() => checkAndHighlightRelevantTags(retryIn), retryIn);
		}
	}

	// Listen for preference changes
	storage.watch({
		preferences: (c) => {
			const oldStyle = document.querySelector("#color-wave-keyframes");
			if (oldStyle) {
				oldStyle.remove();
			}
			checkAndHighlightRelevantTags();
		},
	});

	setTimeout(() => {
		checkAndHighlightRelevantTags(3000);
		checkAndHighlightRelevantTags(5000);
	}, 1000);
});
