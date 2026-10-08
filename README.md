# Kiss Me, Miss My Stop: the music video

A deliberately absurd, meme-flavoured canvas visualiser for the Suno track
"Kiss Me, Miss My Stop" (124 BPM melodic house, 3:52). No build step and no
dependencies, just ES modules, Canvas 2D and the Web Audio API.

## Run it

```sh
npm start            # serves on http://localhost:5173
# or: node server.mjs 8080
```

Open the page, hit PLAY (browsers need a click before audio can start).

Controls: `Space` play/pause, `F` fullscreen, `M` mute, `Left`/`Right` skip 5s,
or use the control bar at the bottom.

## What you get

- Karaoke captions with word-by-word highlight, timed from the actual vocal.
- One stage per song section (intro, verse, chorus, drop, breakdown, bridge,
  outro, credits) with a recurring cast: Tania (pink, bat ears), Guy (teal, faun
  horns), the Purple Sofa (guilty) and the Express to Dinner train.
- Around 150 timed gags that follow the lyrics literally (the Tinder profiles,
  the chess undo, KISSING.EXE, the thermostat, and so on).
- Beat-reactive camera, kick pulses, RGB split and scanlines in the drops.
- Everything is a pure function of `audio.currentTime`, so seeking and
  pausing always show the right frame.

## Layout

```
index.html          page + splash + control bar
css/style.css
server.mjs          tiny static server with HTTP Range (needed for audio seeking)
assets/             cover.jpg, kiss-me-miss-my-stop.mp3
js/timeline.js      BPM, section boundaries, lyric timings
js/util.js          drawing and easing helpers
js/art.js           blobs, sofa, train, props
js/backgrounds.js   backdrops
js/scenes.js        per-section stages and camera
js/cues-a.js        gags, intro to drop 1
js/cues-b.js        gags, verse 2 to credits
js/main.js          render loop, audio clock, captions, HUD, UI
```

## How the timing was derived

- Lyric timestamps come from a word-level transcription of the MP3, matched to
  the lyrics you supplied.
- Section boundaries come from per-bar loudness.
- Tempo fitted at 124.25 BPM with the first beat at 0.395s, which gives a
  deterministic beat grid. When audio is playing, the live bass from an
  `AnalyserNode` is blended in for the kick pulse.

## Adding or changing gags

Gags are registered with `cue(startSeconds, endSeconds, (ctx, frame, c) => { ... })`
in `js/cues-a.js` and `js/cues-b.js`. `c.lt` is seconds since the cue began.

For fast iteration, open `http://localhost:5173/?t=95` to jump straight to
95 seconds. `window.__mv.seekTo(t)` does the same from the console, and
`window.__errs` collects any cue exceptions.
