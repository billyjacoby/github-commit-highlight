import type { UserPreferences } from "@/types/types";

export function createKeyframeStyle(prefs: UserPreferences) {
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

export function highlightTags(tags: HTMLElement[], prefs: UserPreferences) {
	if (!tags.length) return;

	for (const tag of tags) {
		tag.style.animation = "colorWave 2s ease forwards";
		if (!document.querySelector("#color-wave-keyframes")) {
			const style = createKeyframeStyle(prefs);
			document.head.appendChild(style);
		}
	}
}
