import assert from "node:assert/strict";
const { chromium, webkit } = await import(process.argv[2]);
const base = process.argv[3] ?? "http://127.0.0.1:8243";
for (const [name, engine] of Object.entries({ chromium, webkit })) {
  const b = await engine.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  try {
    await p.goto(base);
    await p.locator("#open-layout").click();
    await p.locator("#open-l04").click();
    await p.waitForFunction(() => gramlot.data.getItem("galleryGuide.available"));
    await p.locator("#index-code-toggle").click();
    const handles = [p.locator("#gallery-regions").getByRole("button", { name: "Close left region", exact: true }), p.locator('#gallery-guide-layout .separator[data-side="bottom"] > .drawer')];
    for (const [i, h] of handles.entries()) {
      await p.mouse.move(20, 20);
      await p.waitForTimeout(220);
      let box2 = await h.boundingBox();
      assert((i === 0 ? box2.width : box2.height) <= 4.1, JSON.stringify(box2));
      assert.equal(await h.locator(".drawer-content").evaluate((e) => getComputedStyle(e).opacity), "0");
      await h.hover();
      await p.waitForTimeout(220);
      box2 = await h.boundingBox();
      assert((i === 0 ? box2.width : box2.height) <= 21, JSON.stringify(box2));
      assert.equal(await h.locator(".drawer-content").evaluate((e) => getComputedStyle(e).opacity), "1");
      const clipping = await h.locator(".drawer-content").evaluate((e) => ({ w: e.clientWidth, sw: e.scrollWidth, h: e.clientHeight, sh: e.scrollHeight }));
      assert(clipping.sw <= clipping.w && clipping.sh <= clipping.h, JSON.stringify(clipping));
      await p.screenshot({ path: `/tmp/drawer-unified-${name}-${i}.png` });
    }
    const iframe = await p.locator("#frame-l04").evaluateHandle((e) => e.contentDocument);
    await handles[1].click();
    await handles[1].click();
    assert.equal(await p.evaluate((doc) => doc === document.querySelector("#frame-l04").contentDocument, iframe), true);
    const guide = handles[1];
    await guide.hover();
    const box = await guide.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.down();
    await p.mouse.move(box.x + box.width / 2, box.y - 30, { steps: 5 });
    await p.mouse.up();
    assert.equal(await guide.getAttribute("aria-expanded"), "true");
    const touch = await b.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
    const phone = await touch.newPage();
    await phone.goto(base);
    await phone.locator("#gallery-mobile-menu").click();
    await phone.locator("#open-layout").click();
    await phone.locator("#open-l04").click();
    await phone.waitForFunction(() => gramlot.data.getItem("galleryGuide.available"));
    const phoneGrip = phone.locator('#gallery-guide-layout .separator[data-side="bottom"] > .drawer');
    assert.equal(await phoneGrip.locator(".drawer-content").evaluate((e) => getComputedStyle(e).opacity), "1");
    assert((await phoneGrip.boundingBox()).height <= 20);
    await touch.close();
    assert.deepEqual(errors, []);
    console.log(`${name}: 4px rest, icon/caption hidden together, <=20px expanded thickness, uncut text, toggle/drag and retained iframe passed`);
  } finally {
    await b.close();
  }
}
