// Song map for "Kiss Me, Miss My Stop".
// Section boundaries come from an energy analysis of the audio, line start times
// come from word-level transcription of the track (lyrics text is the official one).

export const TITLE = 'Kiss Me, Miss My Stop';
export const BPM = 124.25;
export const BEAT0 = 0.395; // time of the first kick
export const DURATION = 232.4;

export const SECTIONS = [
  { id: 'intro', label: 'Intro', t0: 0, t1: 15.6 },
  { id: 'v1', label: 'Verse 1', t0: 15.6, t1: 46.8 },
  { id: 'c1', label: 'Chorus', t0: 46.8, t1: 62.3 },
  { id: 'drop1', label: 'Drop', t0: 62.3, t1: 75.2 },
  { id: 'v2', label: 'Verse 2', t0: 75.2, t1: 92.0 },
  { id: 'c2', label: 'Chorus', t0: 92.0, t1: 108.5 },
  { id: 'brk', label: 'Breakdown', t0: 108.5, t1: 121.2 },
  { id: 'v3', label: 'Verse 3', t0: 121.2, t1: 144.2 },
  { id: 'bridge', label: 'Bridge', t0: 144.2, t1: 170.0 },
  { id: 'c3', label: 'Final Chorus', t0: 170.0, t1: 186.0 },
  { id: 'drop2', label: 'Drop', t0: 186.0, t1: 199.0 },
  { id: 'outro', label: 'Outro', t0: 199.0, t1: 215.0 },
  { id: 'credits', label: 'Credits', t0: 215.0, t1: 232.4 },
];

// [startSeconds, text]
export const LYRICS = [
  [15.8, 'Booked a table, blew my cover'],
  [18.6, 'Full name sitting on your phone'],
  [20.7, "You'd already done your research"],
  [22.4, 'But my Instagram gave nothing away'],
  [24.9, 'You were \u201CTania Tinder\u201D'],
  [26.3, 'I was \u201COrgy Guy\u201D'],
  [28.2, 'Quite a reputation'],
  [29.8, "For a man you hadn't met in real life"],
  [32.7, 'Your faun pants met disaster'],
  [36.2, 'Batgirl came to save the day'],
  [39.2, 'I said my nymph outfit was ready'],
  [43.0, "Then checked you wouldn't dress that way"],

  [47.1, 'Kiss me, miss my stop'],
  [48.9, 'There goes my sense of direction'],
  [50.6, 'You nearly caught the wrong train'],
  [52.7, 'I blame your excellent distraction'],
  [54.5, 'One more minute, one more kiss'],
  [56.3, 'Who decided we should leave?'],
  [58.4, 'Perfectly sensible adults'],
  [60.3, 'Until you get close to me'],
  [67.7, 'Until you get close to me'],

  [75.5, "You said the maths wasn't mathing"],
  [77.9, 'We were home but miles apart'],
  [79.8, 'I tried fixing it with spelling'],
  [81.6, 'Not my most convincing start'],
  [83.6, 'We played chess, you asked for undo'],
  [85.3, "Sorry, that's not in the code"],
  [87.2, 'Apparently I build the board'],
  [89.3, 'Then break it as we go'],

  [92.3, 'Kiss me, miss my stop'],
  [93.8, 'There goes my sense of direction'],
  [95.8, 'You nearly caught the wrong train'],
  [97.6, 'I blame your excellent distraction'],
  [99.5, 'One more minute, one more kiss'],
  [101.3, 'Who decided we should leave?'],
  [103.3, 'Perfectly sensible adults'],
  [105.2, 'Until you get close to me'],
  [113.9, 'Close to me'],

  [121.5, 'We booked somewhere you suggested'],
  [123.7, 'So the blame was split in two'],
  [125.5, 'Talked all night, then at the station'],
  [127.6, 'Found some more important things to do'],
  [129.7, 'You said, \u201CCan kissing get finished?\u201D'],
  [131.5, "That's a question worth a test"],
  [133.0, 'You hit the gym next morning'],
  [135.2, 'I conducted mine in bed'],
  [137.0, 'Rum as pre-workout?'],
  [138.9, 'You sent photographic proof'],
  [140.5, 'I raised my coffee to you'],
  [142.4, "That's the most that I could do"],

  [144.4, 'Saturday, five-thirty'],
  [146.8, 'Dinner and a film'],
  [147.8, 'Purple sofa looking guilty'],
  [150.0, "But I'm keeping it until\u2026"],
  [151.7, "Well, let's say it has character"],
  [153.9, 'And cushions hide a lot'],
  [155.2, 'I offered human heating'],
  [157.4, 'Then found the thermostat'],
  [159.0, "I said I'd pretend it's broken"],
  [160.9, 'You said, \u201CNo need for that\u201D'],
  [162.6, 'You like the heat and hugs already'],
  [164.6, "Could've saved me all that chat"],

  [170.4, 'Kiss me, miss my stop'],
  [171.9, "Let's retire that situation"],
  [173.8, "Next time I'll be cooking"],
  [175.6, 'You can skip the railway station'],
  [177.6, 'One more minute, one more kiss'],
  [179.3, 'No audience this time'],
  [181.2, 'You bring your choice of music'],
  [183.3, "I'll put dinner out on time"],
  [190.0, "I'll put dinner out on time"],

  [199.3, 'No seafood, no mushrooms'],
  [203.4, 'Got that written down'],
  [206.5, 'Projector, pillows, purple sofa'],
  [210.0, "We'll see how that works out"],
];

export function sectionAt(t) {
  for (const s of SECTIONS) if (t < s.t1) return s;
  return SECTIONS[SECTIONS.length - 1];
}

// Index of the lyric that is currently sung (or just finished), or -1.
export function lineAt(t) {
  let idx = -1;
  for (let i = 0; i < LYRICS.length; i++) {
    if (LYRICS[i][0] <= t) idx = i;
    else break;
  }
  return idx;
}

export function lineEnd(i) {
  const start = LYRICS[i][0];
  const next = i + 1 < LYRICS.length ? LYRICS[i + 1][0] : start + 4;
  return Math.min(next, start + 5);
}
