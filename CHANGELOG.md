# Changelog

## 3.4.9 - 2026-07-17

### Fixed
- Fixed desktop icon layout migration when new icons are added after users already have saved icon positions.
- Increased desktop icon cell height so longer labels have room and do not overlap the next shortcut.

### Removed
- Removed the visitor counter from About / Credits and deleted the unused visitors API.
- Removed Projects from My Documents.
- Removed the Guest Book share badge shown after sending a message.

## 3.4.8 - 2026-07-17

### Added
- Added Minesweeper to the desktop.

### Changed
- Reduced mobile Solitaire window height to remove extra gray space.
- Moved Breakout mobile controls to the left and right edges for easier play.

## 3.4.7 - 2026-07-17

### Changed
- Made Tetris start with a random first piece.
- Made Breakout launch the ball upward with randomized horizontal direction and speed.
- Centered Breakout mobile controls.
- Added `.exe` suffixes to every game name in the Games folder.
- Tightened mobile Solitaire height and reduced the extra empty area below the table.

## 3.4.6 - 2026-07-17

### Added
- Added a Breakout game-over dialog with New Game and Exit actions.

### Changed
- Removed noisy file-description popups when opening files from disk windows.

## 3.4.5 - 2026-07-17

### Added
- Added a wider randomized word list for Typing Tutor.

### Changed
- Made the Games folder open at the standard folder-window height.
- Made Snake, Tetris, Breakout, Pixel Puzzle and Typing Tutor windows more compact on desktop and mobile.
- Improved mobile sizing for compact game windows so they do not stretch across the full screen.
- Improved mobile Solitaire sizing with tighter card spacing and less empty gray area.

### Fixed
- Fixed Breakout continuing after the ball falls below the paddle.
- Fixed Typing Tutor always starting with the same first word.

## 3.4.4 - 2026-07-17

### Added
- Added mobile-friendly on-screen controls for Snake, Tetris, Breakout and Typing Tutor.
- Added clearer mobile play hints for Pixel Puzzle.

### Changed
- Improved mobile window sizing for Solitaire, Display Properties and Share.
- Scaled Solitaire on mobile so the full table fits inside the window.
- Disabled maximize controls for Snake, Tetris, Breakout, Pixel Puzzle and Typing Tutor.
- Improved mobile window restore and resize clamping so saved desktop window sizes cannot overflow small screens.

### Fixed
- Fixed mobile Solitaire being cropped on narrow screens.
- Fixed Display Properties and Share windows appearing too short on mobile.

## 3.4.0 - 2026-07-15

### Added
- Added retro Guest Book avatars with original pixel-style icons.
- Added avatar support to the Guest Book API, PostgreSQL store, in-memory fallback, profile storage, and database migration.
- Added ICQ-style status choices beyond Online / Do Not Disturb.
- Added safe Guest Book formatting for line breaks, emoticons, `[b]`, `[i]`, and `[url]` without rendering raw HTML.
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
