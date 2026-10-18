import test from "node:test";
import assert from "node:assert/strict";
import { Bag } from "@genrojs/bag";
import { GuidedDemo } from "../src/gramlot_examples/gallery/browser/gallery-guide.js";
function fixture(voice = false) {
  const data = new Bag(), target = new Bag();
  const steps = [0, 1, 2].map((n) => ({ title: `Step ${n}`, text: `Caption ${n}`, changes: { value: n }, seconds: 4 }));
  for (const [key, value] of Object.entries({ steps, count: 3, status: "ready", position: -1, executed: -1, voice, voiceAvailable: true, available: true, rate: "1" })) data.setItem(`galleryGuide.${key}`, value);
  const timers = /* @__PURE__ */ new Map();
  let id = 0, utterance = null, cancelled = 0;
  const window = {
    setTimeout(fn) {
      timers.set(++id, fn);
      return id;
    },
    clearTimeout(id2) {
      timers.delete(id2);
    },
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
      }
    },
    speechSynthesis: { speak(value) {
      utterance = value;
    }, cancel() {
      cancelled++;
    }, getVoices() {
      return [{ lang: "en-GB" }];
    } }
  };
  const player = new GuidedDemo(data, window);
  player.target = target;
  const tick = () => {
    const list = [...timers.values()];
    timers.clear();
    for (const fn of list) fn();
  };
  return { player, target, timers, window, tick, get utterance() {
    return utterance;
  }, get cancelled() {
    return cancelled;
  } };
}
test("automatic steps, completion and Stop retain accepted Data", () => {
  const f = fixture();
  f.player.play();
  assert.equal(f.target.getItem("value"), 0);
  f.tick();
  assert.equal(f.target.getItem("value"), 1);
  f.player.stop();
  f.tick();
  assert.equal(f.target.getItem("value"), 1);
  f.player.play();
  f.tick();
  f.tick();
  f.tick();
  assert.equal(f.player.get("status"), "finished");
  assert.equal(f.target.getItem("value"), 2);
});
test("manual Next executes; Back only reviews; resume does not overwrite user edits", () => {
  const f = fixture();
  f.player.next();
  f.player.next();
  f.player.previous();
  assert.equal(f.target.getItem("value"), 1);
  assert.equal(f.player.get("position"), 0);
  f.target.setItem("value", "user edit");
  f.player.play();
  assert.equal(f.target.getItem("value"), "user edit");
  f.player.pause();
  f.tick();
  assert.equal(f.player.get("position"), 0);
});
test("speech gates advancement; pause cancels and ignores late callbacks", () => {
  const f = fixture(true);
  f.player.play();
  assert.equal(f.timers.size, 0);
  const late = f.utterance.onend;
  f.player.pause();
  late();
  assert.equal(f.timers.size, 0);
  assert.equal(f.cancelled, 1);
  f.player.play();
  f.utterance.onend();
  assert.equal(f.timers.size, 1);
  f.tick();
  assert.equal(f.target.getItem("value"), 1);
  f.player.stop();
  assert.equal(f.cancelled, 2);
});
test("voice error or unavailable voice preserves caption playback; mute cancels narration", () => {
  const f = fixture(true);
  f.player.play();
  f.utterance.onerror();
  f.tick();
  assert.equal(f.player.get("position"), 1);
  assert.match(f.player.get("voiceMessage"), /captions/);
  f.player.set("voice", false);
  f.player.voiceChanged();
  assert.equal(f.cancelled, 1);
  f.tick();
  assert.equal(f.player.get("position"), 2);
  const g = fixture(true);
  g.player.set("voiceAvailable", false);
  g.player.play();
  assert.equal(g.timers.size, 1);
});
test("reviewing applied steps never replays their changes on Next or resumed playback", () => {
  const f = fixture();
  f.player.next();
  f.player.next();
  f.target.setItem("value", "user edit");
  f.player.previous();
  f.player.next();
  assert.equal(f.target.getItem("value"), "user edit");
  f.player.previous();
  f.player.play();
  f.tick();
  assert.equal(f.player.get("position"), 2);
  assert.equal(f.player.get("executed"), 2);
  assert.equal(f.target.getItem("value"), 2, "only the next unexecuted action runs");
  f.target.setItem("value", "final user edit");
  f.player.previous();
  f.player.play();
  f.tick();
  assert.equal(f.player.get("status"), "finished");
  assert.equal(f.target.getItem("value"), "final user edit");
});
