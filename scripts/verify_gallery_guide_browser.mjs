import assert from "node:assert/strict";
const { chromium, webkit } = await import(process.argv[2]);
const base = process.argv[3] ?? "http://127.0.0.1:8243";
for (const [name, engine] of Object.entries({ chromium, webkit })) {
  const browser = await engine.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    const speech = new EventTarget();
    speech.current = null;
    speech.cancelled = 0;
    speech.getVoices = () => [{ lang: "en-US", name: "Test English" }];
    speech.speak = (u) => {
      speech.current = u;
    };
    speech.cancel = () => {
      speech.cancelled++;
      speech.current = null;
    };
    Object.defineProperty(window, "speechSynthesis", { value: speech });
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
  });
  try {
    await page.goto(base);
    await page.waitForFunction(() => window.gramlot?.data.getItem("galleryIndex.opened.intro") === true);
    await page.locator("#open-layout").click();
    await page.locator("#open-l04").click();
    await page.waitForFunction(() => gramlot.data.getItem("galleryGuide.available") === true);
    const frame = page.frameLocator("#frame-l04");
    const read = (path) => page.evaluate((path2) => document.querySelector("#frame-l04").contentWindow.gramlot.data.getItem(path2), path);
    const get = (key) => page.evaluate((key2) => gramlot.data.getItem(`galleryGuide.${key2}`), key);
    const click = (name2) => page.locator(`#gallery-guide-${name2}`).click();
    const identity = await page.locator("#frame-l04").evaluateHandle((f) => f.contentDocument);
    for (let step = 0; step < 8; step++) {
      await click("next");
      assert.equal(await get("position"), step);
      if (step === 2) assert.equal(await read("drawerFilters"), "close");
      if (step === 3) {
        assert.equal(await read("filtersWidth"), "220px");
        assert.equal(await read("drawerFilters"), true);
      }
      if (step === 4) assert.equal(await read("customer"), "Grace Hopper");
      if (step === 6) assert.equal(await read("drawerOutput"), "close");
    }
    assert.equal(await frame.getByText("Shared note: Written while Output was closed", { exact: true }).evaluate((el) => el.getBoundingClientRect().bottom <= el.ownerDocument.defaultView.innerHeight), true);
    assert.equal(await read("delivery"), "express");
    assert.equal(await read("drawerOutput"), true);
    assert.equal(await frame.locator("#handles-note input").inputValue(), "Written while Output was closed");
    await click("previous");
    assert.equal(await read("drawerOutput"), true);
    await click("stop");
    await click("play");
    await click("pause");
    await page.evaluate(() => document.querySelector("#frame-l04").contentWindow.gramlot.data.setItem("drawerFilters", "close"));
    await click("play");
    assert.equal(await read("drawerFilters"), "close");
    await page.locator("#preview-l04").getByRole("tab", { name: "Explanation", exact: true }).click();
    assert.equal(await get("status"), "paused");
    await page.locator("#preview-l04").getByRole("tab", { name: "Example", exact: true }).click();
    await click("stop");
    await page.evaluate(() => {
      const steps = gramlot.data.getItem("galleryGuide.steps");
      gramlot.data.setItem("galleryGuide.steps", steps.map((s) => ({ ...s, seconds: 0.08 })));
    });
    await page.locator("#gallery-guide-voice input").check();
    await click("play");
    await page.waitForFunction(() => speechSynthesis.current !== null);
    await page.waitForTimeout(160);
    assert.equal(await get("position"), 0);
    await page.evaluate(() => speechSynthesis.current.onend());
    await page.waitForFunction(() => gramlot.data.getItem("galleryGuide.position") === 1);
    await page.locator("#gallery-guide-voice input").uncheck();
    await page.waitForFunction(() => gramlot.data.getItem("galleryGuide.status") === "finished");
    assert.ok(await page.evaluate(() => speechSynthesis.cancelled) > 0);
    assert.equal(await read("customer"), "Grace Hopper");
    assert.equal(await read("drawerOutput"), true);
    assert.equal(await page.evaluate((ref) => ref === document.querySelector("#frame-l04").contentDocument, identity), true);
    await page.locator("#index-code-toggle").click();
    await page.locator("#gallery-settings-toggle").click();
    for (const theme of ["mimi", "joanna"]) {
      await page.locator("#index-appearance").selectOption(theme);
      await page.locator("#index-theme").selectOption(theme === "mimi" ? "light" : "dark");
      await page.locator("#gallery-settings").getByRole("button", { name: "Close settings", exact: true }).click();
      await page.screenshot({ path: `/tmp/gallery-guide-${theme}-${name}.png` });
      await page.locator("#gallery-settings-toggle").click();
    }
    await page.locator("#gallery-settings").getByRole("button", { name: "Close settings", exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `/tmp/gallery-guide-phone-${name}.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator("#gallery-guide-voice input").check();
    await click("play");
    await page.locator("#gallery-view-code").click();
    assert.equal(await get("status"), "paused");
    await page.locator("#gallery-view-example").click();
    assert.equal(await read("customer"), "Grace Hopper");
    assert.deepEqual(errors, []);
    console.log(`${name}: eight steps, Data/iframe retention, review, pause/resume, narration gating/mute, themes and mobile passed`);
  } finally {
    await browser.close();
  }
}
