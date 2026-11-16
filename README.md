# LeWell theme for Claude

Animated pixel-art backdrops for the **Claude desktop app**. Lewy, the moss buddy from
[LeWell](https://lewell.app), walks while Claude works and stands still (and blinks)
when Claude is done or needs you. One glance tells you whether Claude is busy or
waiting on you.

![Lewy on a snowy Christmas night](images/christmas.jpg)

> Backdrops only show in the Claude desktop app. In the terminal, VS Code or the
> mobile app the theme does nothing, so it's safe to leave installed everywhere.

## Install in 3 steps

1. In the Claude desktop app, click **+** next to the prompt box, then **Plugins**.
2. Click **Add marketplace** and enter `kimthangk/claude-theme-lewell`.
3. Find **lewell-theme** in the list and click **Add plugin**.

Then start a new session. You'll see Lewy on a city street. Send any message and he
starts walking.

<details>
<summary>Prefer the terminal?</summary>

At the prompt of a Claude Code session:

```
/plugin install lewell-theme --marketplace kimthangk/claude-theme-lewell
```

Or from a shell:

```bash
claude plugin install lewell-theme --marketplace kimthangk/claude-theme-lewell
```

Answer `y` to add the marketplace, then pick the **user** scope so every session
gets it. The backdrop still only shows in the desktop app.

</details>

## Pick a scene

Type `/scene` followed by a scene name in the desktop app, for example:

```
/scene lewell-tokyo
```

Type `/scene` alone to list them all. Your pick is remembered for new sessions.

<table>
<tr>
<td width="50%"><img src="images/christmas.jpg" alt="Christmas night"><br><b>Christmas night</b>: a snowy village with Christmas lights<br><code>/scene lewell-xmas-night</code></td>
<td width="50%"><img src="images/city-tour.gif" alt="City tour"><br><b>City tour</b> (default): all seven cities, a new one every 30 seconds of walking<br><code>/scene lewell-city-tour</code></td>
</tr>
<tr>
<td><img src="images/bangkok.jpg" alt="Bangkok"><br><b>Bangkok</b>: Wat Arun and the Grand Palace<br><code>/scene lewell-bangkok</code></td>
<td><img src="images/tokyo.jpg" alt="Tokyo"><br><b>Tokyo</b>: Tokyo Tower, Fuji and a torii<br><code>/scene lewell-tokyo</code></td>
</tr>
<tr>
<td><img src="images/paris.jpg" alt="Paris"><br><b>Paris</b>: the Eiffel Tower and the Arc de Triomphe<br><code>/scene lewell-paris</code></td>
<td><img src="images/london.jpg" alt="London"><br><b>London</b>: Big Ben, Parliament and the London Eye<br><code>/scene lewell-london</code></td>
</tr>
<tr>
<td><img src="images/newyork.jpg" alt="New York"><br><b>New York</b>: the Empire State, the Chrysler and Liberty<br><code>/scene lewell-newyork</code></td>
<td><img src="images/sanfrancisco.jpg" alt="San Francisco"><br><b>San Francisco</b>: the Golden Gate and the Transamerica Pyramid<br><code>/scene lewell-sanfrancisco</code></td>
</tr>
<tr>
<td><img src="images/singapore.jpg" alt="Singapore"><br><b>Singapore</b>: Marina Bay Sands, the Supertrees and the Merlion<br><code>/scene lewell-singapore</code></td>
<td></td>
</tr>
</table>

The pictures show Lewy standing. While Claude works he walks, the street scrolls
and the landmarks drift slowly behind him.

## Turn it off

In the desktop app, open **+**, then **Plugins**, and turn off or remove
**lewell-theme**. From a shell:

```bash
claude plugin disable lewell-theme
claude plugin uninstall lewell-theme
```

Your usual backdrop comes back in the next session.

## For builders: how it works

The theme is a Claude Code mod (a plugin with a hooks module). It listens for
`turn.start`, `turn.complete` and tool calls to know when Claude is working, and
draws each scene as one SVG made in code: no image files, no network.

What we learned getting animation to play in the desktop backdrop:

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
