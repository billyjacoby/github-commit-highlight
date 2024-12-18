# Recent Commit Highlighter

A Chrome extension that enhances GitHub's repository view by highlighting recent commits, making it easier to track new changes in your repositories.

## Features

- 🎨 **Custom Highlight Color**: Choose any color to highlight recent commits
- 📅 **Configurable Time Range**: Set how many days of recent commits to highlight (1-30 days)
- ⭐ **Most Recent Commit**: Option to always highlight the most recent commit, regardless of its age
- ✨ **Visual Feedback**: Smooth animation effect when highlighting commits
- 🔄 **Real-time Updates**: Changes take effect immediately as you navigate through GitHub

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/billyjacoby/recent-commit-highlight.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   pnpm build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

## Usage

1. Click the extension icon in your browser toolbar to open the settings popup
2. Customize your preferences:
   - Choose your preferred highlight color
   - Set how many days of commits you want to highlight
   - Toggle whether to always highlight the most recent commit
3. Click "Save Changes" to apply your settings
4. Navigate to any GitHub repository to see the highlights in action

## Development

This extension is built with:
- [Plasmo](https://docs.plasmo.com/) - The browser extension framework
- React - For the popup UI
- TypeScript - For type safety
- Tailwind CSS - For styling

To start development:
```bash
pnpm dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
