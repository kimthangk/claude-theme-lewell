# LeWell theme for Claude

Animated pixel-art backdrops for the Claude desktop app. Lewy, the moss buddy from
[LeWell](https://lewell.app), walks while Claude works and stands still (and blinks)
when Claude is done or needs you. You can tell at a glance whether Claude is busy
or waiting.

![Lewy in Tokyo](images/tokyo.jpg)

## Scenes

| | |
| --- | --- |
| ![Bangkok](images/bangkok.jpg) | ![Paris](images/paris.jpg) |
| ![London](images/london.jpg) | ![New York](images/newyork.jpg) |
| ![San Francisco](images/sanfrancisco.jpg) | ![Singapore](images/singapore.jpg) |
| ![Christmas night](images/christmas.jpg) | |

- **`lewell-city-tour`** (default): Lewy walks the evening streets of seven cities,
  a new city every 30 seconds of walking. The landmarks drift slowly behind the street.
- **One city**: `lewell-bangkok`, `lewell-tokyo`, `lewell-paris`, `lewell-london`,
  `lewell-newyork`, `lewell-sanfrancisco`, `lewell-singapore`.
- **`lewell-xmas-night`**: a snowy village under the moon, with Christmas lights.

Switch with `/scene <name>`. Your pick is remembered across sessions, and Lewy's
walk carries on from where he stopped.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install lewell-theme --marketplace kimthangk/claude-theme-lewell
```

From a shell:

```bash
claude plugin install lewell-theme --marketplace kimthangk/claude-theme-lewell
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box,
then **Plugins**, **Add marketplace** with `kimthangk/claude-theme-lewell`, then
**Add plugin**.

Answer `y` to add the marketplace and pick the user scope, so every session gets it.

## Where it shows

Backdrops are drawn by the **Claude desktop app** only. In the terminal, VS Code or
the mobile app the theme stays quiet and changes nothing.

## How it works

The theme is a Claude Code mod (a plugin with a hooks module). It listens for
`turn.start`, `turn.complete` and tool calls to know when Claude is working, and
draws each scene as one code-made SVG. Everything is drawn in code: no image files,
no network.

A few things we learned getting animation to play in the desktop backdrop, in case
you build your own:

- Only code-drawn SVG shows. Keep it one flat `<svg>` with the `<style>` first.
- CSS keyframes play only while the drawing stays light: a few hundred large shapes,
  not thousands of tiny strokes. Gather lights of one color into one path.
- The backdrop redraws only when the scene name changes, so a walk/stand change sets
  the theme again under a flipped name (`scene_a` / `scene_b`).
- Scrolling layers are drawn once and copied with `<use>`, then moved with a linear
  CSS animation. Walk poses are stacked and switched with stepped animations.

## License

The code is MIT licensed, see [LICENSE](LICENSE).

Lewy, the LeWell name and the LeWell logo are trademarks of LEWELL COMPANY LIMITED.
They're included so the theme works as made. Please don't use them to brand your own
apps or products.
