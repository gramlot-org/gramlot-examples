/**
 * Open every example page in Chromium through the core GramlotFileServer of each language:
 * `node scripts/verify_pages_browser.mjs <Python base URL> <JavaScript base URL>`, each a
 * `serve_pages` server on `src/gramlot_examples/pages` (`<base>/<family>/<NN_name>`).
 * Every catalogue entry must have an observable behavior check and start without errors
 * or failed requests. Checks cover static content, bindings, named Logic, lifecycle,
 * local file exchange, endpoints and fragments through `POST /gramlot/rpc`.
 * Integration checks can reuse verifyExample with their page and recorded request envelopes.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {componentBehaviors} from './component-behaviors.mjs';
import {layoutBehaviors} from './layout-behaviors.mjs';

const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));

// Local interactions and visible state, including named Logic where the lesson uses it.
const LOGIC = {
    async b08(page, text) {
        await page.click('#freeze');
        assert.equal(await text('#frozen'), 'true');
        await page.click('#add');
        await page.click('#removeLast');
        await page.click('#removeLast');
        assert.equal(await page.locator('#items li').count(), 3, 'the removal waits for the thaw');
        await page.click('#thaw');
        assert.equal(await page.locator('#items li').count(), 1);
        assert.equal(await text('#count'), '1');
    },
    async c03(page, text) {
        assert.equal(await text('#final'), '80');
        await page.fill('#price', '120');
        await page.waitForFunction(() => document.getElementById('final').textContent === '108');
        assert.equal(await text('#changes'), '1');
    },
    async c08(page, text) {
        await page.click('#press', {modifiers: ['Shift']});
        assert.equal(await text('#presses'), 'Pressed 1 times');
        assert.equal(await text('#modifiers'), 'with Shift');
        await page.click('#freeze');
        await page.click('#removeNote');
        assert.equal(await page.locator('#notes > *').count(), 2);
        await page.click('#thaw');
        assert.equal(await page.locator('#notes > *').count(), 1);
    },
};

// One behaviour per page with endpoints: each step waits for the answer of the server.
const ENDPOINTS = {
    async c08(page, text, calls) {
        const requests = () => calls.filter(({contentType, name}) => contentType === 'data' && name === 'quote').length;
        assert.equal(requests(), 0, 'local stage runs without endpoint calls');
        assert.equal(await text('#quote'), '');
        await page.click('#request-quote');
        await page.waitForFunction(() => document.getElementById('quote').textContent === '2');
        await page.click('#large'); await page.click('#gift');
        assert.equal(await text('#total'), '11'); assert.equal(await text('#quote'), '2');
        assert.equal(requests(), 1);
        await page.click('#request-quote');
        await page.waitForFunction(() => document.getElementById('quote').textContent === '11');
        await page.fill('#quantity', '0'); await page.locator('#quantity').blur();
        await page.click('#request-quote');
        await page.waitForFunction(() => document.getElementById('quote-error').textContent.startsWith('application_error'));
        assert.equal(await text('#quote-error'), 'application_error: Choose at least one item');
        assert.equal(await text('#quote'), '11');
        await page.fill('#quantity', '3'); await page.locator('#quantity').blur();
        await page.click('#request-quote');
        await page.waitForFunction(() => document.getElementById('quote').textContent === '14');
        assert.equal(await text('#quote-error'), ''); assert.equal(requests(), 4);
    },
    async c09(page) {
        await page.waitForFunction(() => document.getElementById('gross').textContent === '15.25');
    },
    async c10(page, text) {
        await page.waitForFunction(() => document.getElementById('status').textContent === 'Answered 10 for 1');
        await page.fill('#quantity', '12');
        await page.waitForFunction(() => document.getElementById('status').textContent === 'Answered 96 for 12');
        assert.equal(await text('#total'), '96');
    },
    async c11(page, text) {
        await page.click('#reserve');
        await page.waitForFunction(() => document.getElementById('error').textContent.startsWith('application_error'));
        assert.equal(await text('#error'), 'application_error: Lamp is out of stock');
        await page.click('#cancel');
        await page.waitForFunction(() => document.getElementById('error').textContent.startsWith('not_authenticated'));
        assert.equal(await text('#reserved'), '');
    },
    async c12(page, text) {
        await page.waitForFunction(() => document.getElementById('stock')?.textContent === '3 in stock');
        await page.selectOption('#record', 'chair');
        await page.waitForFunction(() => document.getElementById('stock')?.textContent === '12 in stock');
        assert.equal(await text('#name'), 'Chair');
    },
    async c13(page, text, calls) {
        const requests = () => calls.filter(({contentType, name}) => contentType === 'source' && name === 'rules').length;
        await page.waitForFunction(() => document.getElementById('mounts').textContent === '1');
        assert.equal(requests(), 1);
        await page.selectOption('#product', 'products.spot');
        await page.waitForFunction(() => document.getElementById('name').textContent === 'Spotlight');
        await page.waitForTimeout(300);
        assert.equal(await text('#mounts'), '1', 'the existing fragment stays mounted');
        assert.equal(requests(), 1, 'same category skips a transport call, independently of mounts');
        await page.selectOption('#product', 'products.chair');
        await page.waitForFunction(() => document.getElementById('mounts').textContent === '2');
        assert.equal(requests(), 2);
        assert.equal(await text('#status'), 'Mounted the seating rules');
        assert.equal(await text('#rule'), 'Ships in a week, assembly required.');
        await page.selectOption('#product', 'products.lamp');
        await page.waitForFunction(() => document.getElementById('mounts').textContent === '3');
        assert.equal(requests(), 3, 'last-result cache, not all categories');
    },
    async c14(page, text, calls) {
        const requests = () => calls.filter(({contentType, name}) => contentType === 'data' && name === 'load_menu').length;
        await page.waitForFunction(() => document.getElementById('menu').textContent === 'Soup, Risotto, Fish');
        await page.click('#read-menu');
        assert.equal(await text('#read-value'), 'Soup, Risotto, Fish');
        assert.equal(requests(), 1);
        await page.selectOption('#table', 'drinks');
        await page.waitForFunction(() => document.getElementById('menu').textContent === 'Water, Lemonade, Coffee');
        assert.equal(await text('#read-value'), 'Soup, Risotto, Fish');
        await page.click('#read-menu');
        assert.equal(await text('#read-value'), 'Water, Lemonade, Coffee');
        // The replacement resolver called at once, asynchronously. A synchronous read on HTTP may call once more: the
        // asynchronous load of the core records the cache time but not the fingerprint of its parameters.
        assert.ok([2, 3].includes(requests()), `load_menu requests: ${requests()}`);
    },
};

LOGIC.b01 = async (page, text) => {
    assert.equal(await text('#local-name'), 'Inner');
    assert.equal(await text('#anchor-name'), 'Outer');
    assert.equal(await text('#parent-name'), 'Outer');
};
LOGIC.c02 = async (page, text) => {
    await page.fill('#tracked-name', 'Mira'); await page.locator('#tracked-name').blur();
    assert.equal(await text('#name_exact'), 'name_exact: 1');
    await page.click('#setName'); assert.equal(await text('#name_exact'), 'name_exact: 2');
    await page.click('#replaceFilter'); assert.equal(await text('#name_exact'), 'name_exact: 2');
    assert.equal(await text('#name_all'), 'name_all: 3');
    await page.click('#changeCity'); assert.equal(await text('#address_exact'), 'address_exact: 0');
    assert.equal(await text('#address_all'), 'address_all: 2');
};
LOGIC.c15 = async (page, text) => {
    assert.equal(await text('#trace'), 'init → built → start');
    await page.click('#inspect'); assert.equal(await text('#lookup'), 'Source → DOM → same Source');
    await page.click('#freeze'); const initial = Number(await text('#ticks'));
    await page.waitForFunction(n => Number(document.getElementById('ticks').textContent) > n, initial);
    assert.equal(await text('#branch-ticks'), await text('#ticks'));
    await page.click('#thaw'); assert.equal(await text('#trace'), 'init → built → start');
    await page.click('#remove'); const stopped = await text('#ticks');
    await page.waitForTimeout(1100); assert.equal(await text('#ticks'), stopped);
    assert.equal(await page.locator('#observed').count(), 0);
};
LOGIC.c16 = async (page, text) => {
    await page.fill('#name', 'Grace'); assert.equal(await text('#greeting'), 'Hello, Grace');
    assert.equal(await page.locator('#card').getAttribute('title'), 'Customer: Grace');
    assert.equal(await page.locator('#card').getAttribute('customer'), 'Grace');
    assert.equal(await page.locator('#preview').getAttribute('sandbox'), '');
    await page.fill('#html', '<h2>Preview two</h2><p>Only this frame changes.</p>');
    await page.frameLocator('#preview').getByRole('heading', {name: 'Preview two'}).waitFor();
};
LOGIC.c17 = async (page, text) => {
    await page.fill('#name', 'Grace'); await page.locator('#name').blur();
    await page.fill('#seats', '3'); await page.locator('#seats').blur();
    const [saved] = await Promise.all([page.waitForEvent('download'), page.click('#save')]);
    const bytes = readFileSync(await saved.path()); assert.equal(saved.suggestedFilename(), 'registration.tytx.json');
    await page.fill('#name', 'Changed'); await page.locator('#name').blur();
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('#restore')]);
    await chooser.setFiles({name: 'saved.json', mimeType: 'application/json', buffer: bytes});
    await page.waitForFunction(() => document.getElementById('status').textContent === 'Restored typed Data');
    assert.equal(await page.locator('#name').inputValue(), 'Grace');
    assert.equal(await page.locator('#seats').inputValue(), '3');
    assert.match(await text('#types'), /note: null/);
    const [json] = await Promise.all([page.waitForEvent('download'), page.click('#exportJson')]);
    const exported = readFileSync(await json.path());
    assert.equal(JSON.parse(exported).find(item => item.label === 'name').value, 'Grace');
    const [xml] = await Promise.all([page.waitForEvent('download'), page.click('#exportXml')]);
    assert.match(readFileSync(await xml.path(), 'utf8'), /<record>/);
    const [bad] = await Promise.all([page.waitForEvent('filechooser'), page.click('#restore')]);
    await bad.setFiles({name: 'export.json', mimeType: 'application/json', buffer: exported});
    await page.waitForFunction(() => document.getElementById('status').textContent.includes('not a saved Gramlot branch'));
    assert.equal(await page.locator('#name').inputValue(), 'Grace');
    await page.click('#previewMail'); assert.match(await text('#mail'), /address.city: Rome/);
};

// Observable lesson checks for the remaining catalogue entries, including static Source.
const input = async (page, selector, value, event = 'input') => page.locator(selector).evaluate(
    (element, args) => { element.value = args.value; element.dispatchEvent(new Event(args.event, {bubbles: true})); }, {value, event});
Object.assign(LOGIC, {
    async e01(page) {
        assert.equal(await page.locator('main').count(), 1);
        assert.equal(await page.locator('main > h1').count(), 1);
        assert.equal(await page.locator('main > p').count(), 1);
    },
    async e02(page) {
        assert.ok((await page.locator('main').textContent()).includes('<tag>'));
        assert.equal(await page.locator('tag').count(), 0);
        await page.getByRole('link', {name: 'Jump back to the heading'}).click();
        assert.equal(new URL(page.url()).hash, '#destination');
    },
    async e03(page) {
        assert.equal(await page.locator('ol > li').count(), 3);
        assert.equal(await page.locator('dl dt').count(), 2);
        assert.ok(await page.locator('ul ul li').count() > 0);
    },
    async e04(page) {
        await page.getByRole('link', {name: 'Notes', exact: true}).click();
        assert.equal(new URL(page.url()).hash, '#notes');
        await page.getByRole('link', {name: 'Story', exact: true}).click();
        assert.equal(new URL(page.url()).hash, '#story');
        assert.equal(await page.locator('main article#story').count(), 1);
    },
    async e05(page) {
        assert.deepEqual(await page.locator('tbody tr').evaluateAll(rows => rows.map(row => row.lastElementChild.textContent)), ['20','20','21']);
        assert.deepEqual(await page.locator('tfoot td').allTextContents(), ['36','25','61']);
    },
    async e06(page) {
        await page.fill('#name', 'Grace'); await page.uncheck('#updates');
        await page.getByRole('button', {name: 'Reset values'}).click();
        assert.equal(await page.inputValue('#name'), 'Ada Lovelace');
        assert.equal(await page.isChecked('#updates'), true);
        assert.equal(await page.getByRole('button', {name: 'Submit unavailable'}).isDisabled(), true);
    },
    async e07(page) {
        const summary = page.getByText('What is Source?', {exact:true});
        const details = summary.locator('..'); const original = await details.getAttribute('open');
        await summary.click(); assert.notEqual(await details.getAttribute('open'), original);
        await summary.click(); assert.equal(await details.getAttribute('open'), original);
        assert.equal(await page.locator('progress').getAttribute('value'), '70');
        assert.equal(await page.locator('meter').getAttribute('value'), '8');
    },
    async e08(page) {
        assert.equal(await page.locator('svg circle').getAttribute('r'), '38');
        assert.equal(await page.locator('svg ellipse').getAttribute('rx'), '26');
        assert.equal(await page.locator('svg ellipse').getAttribute('ry'), '38');
    },
    async e09(page) {
        assert.equal(await page.locator('svg > g').count(), 8);
        assert.equal(await page.locator('svg > g > path').count(), 2);
        assert.equal(await page.locator('svg > g > line').count(), 3);
        assert.equal(await page.locator('svg > g > circle[r="22"]').count(), 9);
    },
    async e10(page) {
        assert.equal(await page.locator('.icon-cards article').count(), 3);
        await page.getByRole('button', {name:'Remove Drawing',exact:true}).click();
        assert.equal(await page.locator('.icon-cards article').count(), 2);
        assert.equal(await page.getByRole('heading', {name:'Drawing',exact:true}).count(), 0);
    },
    async e11(page) {
        assert.deepEqual(await page.locator('.report-number').allTextContents(), ['36','3']);
        assert.equal(await page.locator('svg rect').last().getAttribute('width'), '345');
        assert.equal(await page.locator('tfoot td').textContent(), '36');
    },
    async e12(page) {
        await page.getByRole('link', {name:'Schedule',exact:true}).click();
        assert.equal(await page.locator('#schedule tbody tr').count(), 3);
        assert.deepEqual(await page.locator('#speakers h3').allTextContents(), ['Mira','Theo']);
        await page.getByText('Is the map interactive?', {exact:true}).click();
        assert.equal(await page.getByText('No. It is a schematic SVG illustration.', {exact:true}).isVisible(), true);
    },
    async e13(page) {
        assert.equal(await page.locator('.live-items li').count(), 2);
        await page.getByRole('button', {name:'Add item',exact:true}).click();
        assert.equal(await page.locator('.live-items li').count(), 3);
        await page.getByRole('button', {name:'Clear list',exact:true}).click();
        assert.equal(await page.locator('.live-items li').count(), 0);
        await page.getByRole('button', {name:'Change heading',exact:true}).click();
        assert.equal(await page.locator('h1').textContent(), 'Source is alive!');
        await page.getByRole('button', {name:'Remove animation',exact:true}).click();
        assert.equal(await page.locator('svg').count(), 0);
    },
    async b02(page,text) {
        await page.selectOption('#record','people.alan');
        assert.equal(await text('#field'), 'Computer science');
        await page.fill('#name-field','A. M. Turing'); await page.locator('#name-field').blur();
        await page.selectOption('#record','people.grace');
        assert.equal(await text('#name'),'Grace Hopper');
        await page.selectOption('#record','people.alan');
        assert.equal(await page.inputValue('#name-field'),'A. M. Turing');
    },
    async b03(page,text) {
        assert.equal(await page.inputValue('#customer'),'Grace Hopper');
        assert.equal(await page.inputValue('#quantity'),'1');
        assert.equal(await text('#out-note'),'No note');
        assert.equal(await text('#out-price'),'12.5');
    },
    async b04(page,text) {
        await page.fill('#text','Typed'); assert.equal(await text('#out-text'),'Edit me');
        await page.locator('#text').blur(); assert.equal(await text('#out-text'),'Typed');
        await page.click('#live'); await page.fill('#number','7');
        assert.equal(await text('#out-number'),'7');
    },
    async b05(page,text) {
        await page.click('#team'); assert.equal(await page.isChecked('#plus'),false);
        await page.click('#basic'); assert.equal(await page.isChecked('#team'),false);
        assert.equal(await text('#out-plan-plus'),'false');
    },
    async b06(page) {
        await page.click('#show'); assert.equal(await page.locator('#box').evaluate(e=>e.style.visibility),'hidden');
        await page.click('#hide'); assert.equal(await page.locator('#box').evaluate(e=>e.hidden),true);
    },
    async b07(page,text) {
        await input(page,'#radius','65');
        assert.equal(await page.locator('#circle').getAttribute('r'),'65');
        assert.equal(await text('#radius-label'),'65');
    },
    async b09(page,text) {
        assert.deepEqual(await page.locator('#topics').evaluate(node => [...node.selectedOptions].map(option => option.value)), ['html']);
        await page.selectOption('#topics', ['svg', 'source']);
        assert.deepEqual(await page.evaluate(() => window.gramlot.data.getItem('form.topics')), ['svg', 'source']);
        await page.fill('#name','Grace Hopper'); await page.locator('#name').blur();
        assert.equal(await text('#out-name'),'Grace Hopper');
        await page.click('#daily'); assert.equal(await page.isChecked('#weekly'),false);
    },
    async b10(page,text) {
        await input(page,'#stroke','12');
        assert.equal(await page.locator('#polyline').getAttribute('stroke-width'),'12');
        await page.fill('#label','Shapes'); assert.equal(await text('#caption'),'Shapes');
    },
    async b11(page,text) {
        await page.fill('#title-field','Small interfaces'); assert.equal(await text('#title'),'Small interfaces');
        await page.click('#show-theo');
        assert.equal(await page.locator('#session-1').evaluate(e=>e.style.visibility),'hidden');
        await page.click('#faq-open'); assert.equal(await page.locator('details').evaluateAll(nodes=>nodes.every(n=>n.open)),true);
    },
    async b12(page, text) {
        assert.equal(await page.locator('#customer-name').inputValue(), 'Ada Lovelace');
        assert.equal(await text('#customer-city'), 'London');
        assert.equal(await page.locator('#accent').inputValue(), '#2563eb');
        assert.equal(await page.locator('#draft-name').inputValue(), '');
        await page.fill('#customer-name', 'Grace');
        assert.equal(await text('#customer-preview'), 'Grace');
        await page.click('#fill-sample');
        await page.waitForFunction(() => document.getElementById('draft-city').value === 'London');
        assert.equal(await page.locator('#draft-name').inputValue(), 'Grace');
        await page.fill('#draft-name', 'Independent');
        assert.equal(await page.locator('#customer-name').inputValue(), 'Grace');
        await page.click('#clear-draft');
        assert.equal(await page.locator('#draft-name').inputValue(), '');
        assert.equal(await page.locator('#draft-city').inputValue(), '');
    },
    async c01(page,text) {
        await input(page,'#vat','0.1'); assert.equal(await text('#gross'),'60');
        await input(page,'#quantity','10'); assert.equal(await text('#gross'),'137.5');
    },
    async c04(page,text) {
        await input(page,'#score','70'); assert.equal(await text('#verdict'),'Passed');
        await page.fill('#last','Byron'); assert.equal(await text('#full-name'),'Ada Byron');
        await page.click('#accepted'); assert.equal(await page.isDisabled('#start'),false);
    },
    async c05(page,text) {
        await page.click('#set'); assert.equal(await text('#value'),'1');
        await page.click('#put'); assert.equal(await text('#value'),'1');
        await page.click('#get'); assert.equal(await text('#read'),'11');
        await page.click('#fire'); await page.click('#fire'); assert.equal(await text('#pings'),'2');
        await page.click('#fire-after');
        await page.waitForFunction(()=>document.getElementById('pings').textContent==='3');
        assert.equal(await text('#last'),'later');
    },
    async c06(page,text) {
        await page.click('#press'); await page.click('#press',{modifiers:['Shift']});
        assert.equal(await text('#clicks'),'2'); assert.equal(await text('#keys'),'Shift');
        await page.click('#save-close'); assert.equal(await text('#log'),'save, close');
    },
    async c07(page,text) {
        await page.click('#chip-green'); assert.equal(await text('#clicked'),'chip-green');
        await page.fill('#typing','abc'); assert.equal(await text('#length'),'3');
        await page.locator('#typing').press('x'); assert.equal(await text('#key'),'x');
    },
});

LOGIC.c18 = async (page, text) => {
    await page.locator('#message').fill('One');
    await page.locator('#direct').click();
    assert.equal(await text('#summary'), 'One (click)');
    await page.locator('#publish').click();
    assert.equal(await text('#summary'), 'One (saved)');
    await page.locator('#send-left').click();
    assert.equal(await text('#received-left'), 'Hello left');
    assert.equal(await text('#received-right'), '');
    await page.locator('#ask').click();
    await page.locator('dialog input').fill('Two');
    await page.getByRole('button', {name: 'Confirm', exact: true}).click();
    await page.waitForFunction(() => document.querySelector('#summary').textContent === 'Two (saved)');
    await page.locator('#ask').click();
    await page.getByRole('button', {name: 'Cancel', exact: true}).click();
    assert.equal(await text('#summary'), 'Two (saved)');
};
LOGIC.c19 = async (page, text) => {
    const child = await (await page.locator('#detail').elementHandle()).contentFrame();
    await child.waitForFunction(() => window.gramlot?.state === 'started');
    await page.locator('#message').fill('Parent');
    await page.locator('#send-child').click();
    await child.waitForFunction(() => document.querySelector('#received').textContent === 'Parent');
    assert.equal(await text('#received'), 'Parent');
    await child.locator('#message').fill('Child');
    await child.locator('#reply').click();
    await page.waitForFunction(() => document.querySelector('#received').textContent === 'Child');
};

// An added catalogue entry must receive an observable check, not silently become startup-only.
LOGIC.c20 = async (page, text) => {
    await page.locator('#action').click();
    assert.equal(await text('#result'), 'Hello Ada');
    await page.locator('#action-ask').click();
    await page.locator('dialog input').fill('Grace');
    await page.getByRole('button', {name: 'Confirm', exact: true}).click();
    await page.waitForFunction(() => document.querySelector('#result').textContent === 'Hello Grace');
    await page.locator('#action-ask').click();
    await page.getByRole('button', {name: 'Cancel', exact: true}).click();
    assert.equal(await text('#result'), 'Hello Grace');
    await page.locator('#confirm-needed').uncheck();
    for (const id of ['conditional-action', 'conditional-controller', 'conditional-fields']) {
        await page.locator('#' + id).click();
        assert.equal(await page.locator('dialog').count(), 0);
        assert.equal(await text('#result'), 'Hello Ada');
    }
    await page.locator('#confirm-needed').check();
    for (const id of ['conditional-action', 'conditional-controller', 'conditional-fields', 'legacy-askif']) {
        await page.locator('#' + id).click();
        await page.getByRole('dialog').waitFor();
        await page.getByRole('button', {name: 'Cancel', exact: true}).click();
    }
    await page.locator('#source-reference').click();
    assert.equal(await text('#reference-target'), 'Changed through Source');
    await page.locator('#dom-reference').click();
    assert.equal(await text('#reference-result'), 'DOM element: P');
};
LOGIC.c21 = async (page, text) => {
    await page.locator('#native-value').fill('Edited');
    await page.locator('#native-reset').click();
    assert.equal(await page.locator('#native-value').inputValue(), 'Original');
    await page.locator('#immediate').click();
    assert.equal(await text('#runs'), '1');
    for (const [id, runs] of [['delayed', 2], ['delayed-controller', 3]]) {
        // Three actual clicks in one browser task, well within the declared 600 ms.
        await page.locator('#' + id).evaluate(button => { button.click(); button.click(); button.click(); });
        assert.equal(await text('#runs'), String(runs - 1));
        await page.waitForFunction(n => document.querySelector('#runs').textContent === String(n), runs);
        assert.equal(await text('#count'), '3');
    }
    await page.locator('#delayed').click();
    await page.waitForFunction(() => document.querySelector('#runs').textContent === '4');
    assert.equal(await text('#count'), '1');
    await page.locator('#delayed-ask').evaluate(button => { button.click(); button.click(); });
    assert.equal(await page.locator('dialog').count(), 0);
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', {name: 'Confirm', exact: true}).click();
    await page.waitForFunction(() => document.querySelector('#runs').textContent === '5');
    assert.equal(await text('#count'), '2');
    await page.locator('#delayed-ask').click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', {name: 'Cancel', exact: true}).click();
    assert.equal(await text('#runs'), '5');
};


LOGIC.c22 = async (page, text) => {
    const width = () => page.locator('#width-preview').evaluate(node => node.style.width);
    assert.equal(await width(), '38px');
    await page.locator('#width-input').fill('80');
    assert.equal(await width(), '80px');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('transforms.width')), 80);
    await page.locator('#width-input').fill('');
    assert.equal(await width(), '');
    assert.equal(await page.locator('#name-input').evaluate(node => node.readOnly), true);
    await page.locator('#draft-input').check();
    assert.equal(await page.locator('#name-input').evaluate(node => node.readOnly), false);
    await page.locator('#amount-input').fill('45.5');
    assert.equal(await text('#amount-display'), 'Total: 45,50 €');
    assert.equal(await page.locator('#amount-title').getAttribute('title'), '45,50 €');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('transforms.amount')), 45.5);
};

LOGIC.c23 = async (page, text) => {
    assert.equal(await page.evaluate(() => gramlot.data.getItem('estimate.total')), 270);
    await page.locator('#nights input').focus();
    await page.locator('#nights input').fill('7');
    await page.locator('#nights input').press('Tab');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('estimate.total')), 567);
    await page.locator('#prepare button').click();
    assert.equal(await text('#summary'), 'Stay estimate: €567');
};

Object.assign(LOGIC, componentBehaviors, layoutBehaviors);

for (const family of families) for (const example of family.examples) {
    assert.ok(LOGIC[example.key] || ENDPOINTS[example.key], `Missing behavioral check: ${example.key}`);
}

export async function verifyExample(page, key, calls = []) {
    assert.ok(LOGIC[key] || ENDPOINTS[key], `Missing behavioral check: ${key}`);
    const text = selector => page.locator(selector).textContent();
    await LOGIC[key]?.(page, text);
    await ENDPOINTS[key]?.(page, text, calls);
    if (key === 'c11') {
        assert.equal(await page.locator('#protected-source').count(), 0);
        assert.equal(await page.locator('#hidden-source').getAttribute('hidden'), '');
    }
}

async function check(browser, base, family, example) {
    const url = `${base}/${family.folder}/${example.folder}`;
    const page = await browser.newPage();
    const errors = [];
    const calls = [];
    page.on('request', request => {
        if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/gramlot/rpc')) {
            calls.push(JSON.parse(request.postData()));
        }
    });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => {
        if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(url);
    await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state)).catch(error => {
        throw new Error(`${url}: ${error.message}; browser errors: ${errors.join('; ')}`, {cause:error});
    });
    assert.equal(await page.evaluate(() => window.gramlot.state), 'started', `${url}: ${errors.join('; ')}`);
    assert.ok(await page.evaluate(() => document.getElementById('gramlot-root').childElementCount > 0), url);
    await verifyExample(page, example.key, calls);
    const expectedErrors = [];
    if (example.key === 'html_editor') {
        // This lesson intentionally includes a script to demonstrate sandbox protection.
        expectedErrors.push("Blocked script execution in 'about:srcdoc' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.");
        assert.equal(await page.locator('gramlot-html-preview iframe').getAttribute('sandbox'), '');
        assert.equal(await page.frameLocator('gramlot-html-preview iframe').locator('body').getAttribute('data-executed'), null);
    }
    assert.deepEqual(errors, expectedErrors, url);
    await page.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    const bases = process.argv.slice(2);
    if (bases.length !== 2) throw new Error('Pass the Python and the JavaScript base URL');
    const browser = await chromium.launch({headless: true});
    try {
        for (const [language, base] of [['Python', bases[0]], ['JavaScript', bases[1]]]) {
            let count = 0;
            for (const family of families) {
                for (const example of family.examples) {
                    await check(browser, base, family, example);
                    count += 1;
                }
            }
            console.log(`PASS ${language} ${base}: ${count} pages, targeted bindings/Logic, endpoints, fragments and local file exchange`);
        }
    } finally {
        await browser.close();
    }
}
