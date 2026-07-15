# Changelog

## 3.4.0 - 2026-07-15

### Added
- Added retro Guest Book avatars with original pixel-style icons.
- Added avatar support to the Guest Book API, PostgreSQL store, in-memory fallback, profile storage, and database migration.
- Added ICQ-style status choices beyond Online / Do Not Disturb.
- Added safe Guest Book formatting for line breaks, emoticons, `[b]`, `[i]`, and `[url]` without rendering raw HTML.
- Added Guest Book share badges after a successful signing.
- Added new Win98-style games: Snake, Tetris, Breakout, Pixel Puzzle, Typing Tutor and Checkers.
- Added local high scores for the new lightweight games where applicable.
- Added new game icons for Snake, Tetris, Breakout, Pixel Puzzle and Typing Tutor.
- Added automatic Dial-Up Networking prompt when Internet Explorer or Netscape is opened while offline.

### Changed
- Enlarged the Guest Book window for the richer composer and avatar controls.
- Moved Guest Book avatar selection next to the Nickname field.
- Enlarged the Games folder window.
- Improved mobile Dial-Up window height.
- Removed the Snake desktop shortcut while keeping Snake available in Start, Games, and `C:\Games`.
- Removed Pong from the current game list.
- Updated Help content for version 3.4.0 and the expanded games lineup.
- Updated README release badge and feature list for 3.4.0.

### Fixed
- Fixed repeated notification sounds from the offline browser Dial-Up prompt.
- Fixed a case where the delayed Dial-Up prompt could fail to open.
- Removed missing icon requests for temporary fallback game icons.
- Fixed the README Getting Started code block formatting.
