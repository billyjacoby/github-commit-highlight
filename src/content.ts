import { DEFAULT_PREFERENCES } from "@/contants";
import { highlightTags } from "@/lib/highlight";
import type { UserPreferences } from "@/types/types";
import { Storage } from "@plasmohq/storage";
import { parseDate } from "chrono-node";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
	matches: ["https://github.com/*"],
};

const storage = new Storage();

let url = window.location.href;
let highlightedTags: HTMLElement[] = [];

function checkAndHighlightTags() {
	if (highlightedTags.length) {
		return;
	}

	async function getPreferences(): Promise<UserPreferences> {
		const prefs = await storage.get("preferences");
		return prefs ? JSON.parse(prefs) : DEFAULT_PREFERENCES;
	}

	async function checkAndHighlightRelevantTags(
		retryIn: number | undefined = undefined,
	) {
		const prefs = await getPreferences();
		const relevantTimeTags = document.querySelectorAll<HTMLElement>(
			".react-directory-commit-age",
		);

		let mostRecentDate = new Date(0);
		let mostRecentTags: HTMLElement[] = [];
		const threeDaysAgo = new Date();
		const threeDaysAgoTags: HTMLElement[] = [];
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

		for (const tag of relevantTimeTags) {
			const dateText = tag.textContent?.trim() ?? tag.innerText;
			const parsedDate = parseDate(dateText);

			if (parsedDate && parsedDate >= mostRecentDate) {
				if (parsedDate === mostRecentDate) {
					mostRecentTags.push(tag);
				} else {
					mostRecentTags = [tag];
				}
				mostRecentDate = parsedDate;
			}

			if (parsedDate >= threeDaysAgo) {
				threeDaysAgoTags.push(tag);
			}
		}

		highlightTags([...mostRecentTags, ...threeDaysAgoTags], prefs);

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
}

// biome-ignore lint/complexity/noForEach: <explanation>
["click", "popstate", "onload"].forEach((evt) =>
	window.addEventListener(
		evt,
		() => {
			requestAnimationFrame(() => {
				if (url !== location.href) {
					highlightedTags = [];
					checkAndHighlightTags();
				}
				url = location.href;
			});
		},
		true,
	),
);

window.addEventListener("load", () => {
	checkAndHighlightTags();

	console.log("load");
});