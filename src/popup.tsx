import { DEFAULT_PREFERENCES } from "@/contants";
import type { UserPreferences } from "@/types/types";
import { Storage } from "@plasmohq/storage";
import { useEffect, useState } from "react";

const storage = new Storage();

function IndexPopup() {
	const [preferences, setPreferences] =
		useState<UserPreferences>(DEFAULT_PREFERENCES);

	useEffect(() => {
		// Load saved preferences
		storage.get("preferences").then((prefs) => {
			if (prefs) {
				setPreferences(JSON.parse(prefs));
			}
		});
	}, []);

	const handleColorChange = async (
		key: keyof UserPreferences,
		value: string,
	) => {
		const newPreferences = { ...preferences, [key]: value };
		setPreferences(newPreferences);
		await storage.set("preferences", JSON.stringify(newPreferences));
	};

	return (
		<div className="w-80 p-4">
			<h2 className="mb-4 font-bold text-lg">
				Recent Commit Highlighter Settings
			</h2>

			<div className="space-y-4">
				<div>
					<span className="mb-1 block font-medium text-sm">
						Highlight Color
					</span>
					<input
						type="color"
						value={preferences.highlightColor}
						onChange={(e) =>
							handleColorChange("highlightColor", e.target.value)
						}
						className="h-8 w-full cursor-pointer rounded"
					/>
				</div>

				<button
					type="button"
					onClick={() =>
						handleColorChange(
							"highlightColor",
							DEFAULT_PREFERENCES.highlightColor,
						)
					}
					className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
				>
					Reset to Default
				</button>
			</div>
		</div>
	);
}

export default IndexPopup;
