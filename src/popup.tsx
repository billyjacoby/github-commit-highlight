import { DEFAULT_PREFERENCES } from "@/constants";
import type { UserPreferences } from "@/types/types";
import { Storage } from "@plasmohq/storage";
import { useEffect, useState } from "react";

import "@/style.css";
import { Button } from "./components/ui/button";

const storage = new Storage();

function IndexPopup() {
	const [preferences, setPreferences] =
		useState<UserPreferences>(DEFAULT_PREFERENCES);
	const [savedPreferences, setSavedPreferences] =
		useState<UserPreferences>(DEFAULT_PREFERENCES);
	const hasChanges =
		JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

	useEffect(() => {
		// Load saved preferences
		storage.get("preferences").then((prefs) => {
			if (prefs) {
				const parsedPrefs = JSON.parse(prefs);
				setPreferences(parsedPrefs);
				setSavedPreferences(parsedPrefs);
			}
		});
	}, []);

	const handlePreferenceChange = (
		key: keyof UserPreferences,
		value: string | number | boolean,
	) => {
		const newPreferences = { ...preferences, [key]: value };
		setPreferences(newPreferences);
	};

	const handleSave = async () => {
		await storage.set("preferences", JSON.stringify(preferences));
		setSavedPreferences(preferences);
	};

	const handleReset = () => {
		setPreferences(DEFAULT_PREFERENCES);
	};

	return (
		<div className="min-w-80 bg-background p-4 text-foreground">
			<h2 className="mb-4 font-bold text-lg">Commit Highlighter Settings</h2>

			<div className="space-y-4">
				<div>
					<span className="mb-1 block font-medium text-sm">
						Highlight Color
					</span>
					<input
						type="color"
						value={preferences.highlightColor}
						onChange={(e) =>
							handlePreferenceChange("highlightColor", e.target.value)
						}
						className="h-8 w-full cursor-pointer rounded"
					/>
				</div>

				<div>
					<span className="mb-1 block font-medium text-sm">
						Days to Highlight
					</span>
					<input
						type="number"
						min="1"
						max="30"
						value={preferences.daysToHighlight}
						onChange={(e) =>
							handlePreferenceChange(
								"daysToHighlight",
								Number.parseInt(e.target.value, 10),
							)
						}
						className="w-full rounded border bg-background px-2 py-1"
					/>
				</div>

				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Highlight Most Recent</span>
					<label className="relative inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							checked={preferences.highlightMostRecent}
							onChange={(e) =>
								handlePreferenceChange("highlightMostRecent", e.target.checked)
							}
							className="peer sr-only"
						/>
						<div className="peer rtl:peer-checked:after:-translate-x-full h-6 w-11 rounded-full bg-muted after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
					</label>
				</div>

				<div className="flex w-full justify-center gap-2">
					<Button disabled={!hasChanges} onClick={handleSave}>
						Save Changes
					</Button>
					<Button variant="destructive" onClick={handleReset}>
						Reset to Default
					</Button>
				</div>
			</div>
		</div>
	);
}

export default IndexPopup;
