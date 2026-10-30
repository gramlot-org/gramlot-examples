/** Business interactions derived from legacy address/contact and nesting cases. */
import assert from 'node:assert/strict';
const edit = async (page, id, value) => {
    await page.locator(`#${id} input`).fill(value);
    await page.locator(`#${id} input`).press('Tab');
};
export const groupletBehaviors = {
    async g04(page) {
        await page.locator('#order-shipping-city input').waitFor();
        await edit(page, 'order-customer-name', 'North Engineering Ltd');
        assert.equal(await page.locator('#customer-card .card-title').first().textContent(), 'North Engineering Ltd');
        await edit(page, 'order-shipping-city', 'Bath');
        await edit(page, 'order-delivery-instructions', 'Use gate C after 10:00.');
        assert.equal(await page.locator('#order-billing-city input').inputValue(), 'London');
        assert.equal(await page.locator('#order-city-summary').textContent(), 'Bath');
        for (const id of ['customer-card', 'billing-card', 'delivery-card']) {
            await page.locator(`#${id} .card-check-caption`).first().getByText('Reviewed', {exact: true}).click();
            assert.equal(await page.locator(`#${id}`).getByRole('checkbox', {name: 'Reviewed', exact: true}).first().isChecked(), true);
        }
        assert.equal(await page.locator('#review-progress').textContent(), '3 of 3 sections reviewed');
        await page.locator('#review-delivery input').uncheck();
        assert.equal(await page.locator('#delivery-card .card-check').first().isChecked(), false);
        await page.locator('#review-delivery input').check();
        await page.locator('#workshop-card .card-collapse').press('Enter');
        assert.equal(await page.locator('#workshop-card').evaluate(card => card.controlBox.hidden), true);
        await page.locator('#delivery-card .card-collapse').first().press('Space');
        assert.equal(await page.locator('#fold-delivery input').isChecked(), true);
        await page.locator('#delivery-card .card-title').first().click();
        assert.equal(await page.locator('#delivery-card').evaluate(card => card.controlBox.hidden), false);
        assert.equal(await page.locator('#workshop-card').evaluate(card => card.controlBox.hidden), true);
        await page.locator('#fold-delivery input').check();
        await page.locator('#reload-cards').click();
        await page.waitForFunction(() => document.querySelector('#order-revision')?.textContent.endsWith('2'));
        await page.locator('#order-shipping-city input').waitFor({state: 'attached'});
        assert.equal(await page.locator('#delivery-card').evaluate(card => card.controlBox.hidden), true);
        assert.equal(await page.locator('#delivery-card .card-check').first().isChecked(), true);
        assert.equal(await page.locator('#workshop-card').evaluate(card => card.controlBox.hidden), true);
        assert.equal(await page.locator('#review-progress').textContent(), '3 of 3 sections reviewed');
        await page.locator('#fold-delivery input').uncheck();
        await page.locator('#workshop-card .card-title').click();
        assert.equal(await page.locator('#order-shipping-city input').inputValue(), 'Bath');
        assert.equal(await page.locator('#order-delivery-instructions input').inputValue(), 'Use gate C after 10:00.');
        assert.equal(await page.locator('#order-customer-name input').inputValue(), 'North Engineering Ltd');
        // Return to the top so the saved capture presents the dossier, not a scrolled field.
        await page.locator('h1').scrollIntoViewIfNeeded();
    },
    async g01(page) {
        await page.locator('#customer-first_name input').waitFor();
        await edit(page, 'customer-email', 'purchasing@example.com');
        assert.equal(await page.locator('#customer-email-summary').textContent(), 'purchasing@example.com');
        await page.locator('#customer-kind').selectOption('company');
        await page.locator('#customer-company input').waitFor();
        await edit(page, 'customer-company', 'North Engineering');
        await edit(page, 'customer-vat', 'GB987654321');
        assert.equal(await page.locator('#customer-first_name').count(), 0);
        await page.locator('#customer-kind').selectOption('person');
        await page.locator('#customer-first_name input').waitFor();
        assert.equal(await page.locator('#customer-first_name input').inputValue(), 'Ada');
        assert.equal(await page.locator('#customer-email input').inputValue(), 'purchasing@example.com');
        await page.locator('#customer-kind').selectOption('company');
        await page.locator('#customer-company input').waitFor();
        assert.equal(await page.locator('#customer-company input').inputValue(), 'North Engineering');
        assert.equal(await page.locator('#customer-vat input').inputValue(), 'GB987654321');
    },
    async g02(page) {
        await page.locator('#shipping-city input').waitFor();
        await edit(page, 'shipping-street', '7 Harbour Lane');
        await edit(page, 'shipping-city', 'Bath');
        await edit(page, 'shipping-instructions', 'Call the workshop manager.');
        assert.equal(await page.locator('#shipping-street-summary').textContent(), '7 Harbour Lane');
        assert.equal(await page.locator('#shipping-city-summary').textContent(), 'Bath');
        assert.equal(await page.locator('#billing-city input').inputValue(), 'London');
        assert.equal(await page.locator('#billing-street-summary').textContent(), '18 King Street');
        assert.deepEqual(await page.evaluate(() => [window.gramlot.data.getItem('order.billing.city'),
            window.gramlot.data.getItem('order.shipping.city')]), ['London', 'Bath']);
    },
    async g03(page) {
        await page.locator('#site-city input').waitFor();
        await edit(page, 'contact-name', 'Sam Taylor');
        await edit(page, 'site-city', 'Bath');
        await edit(page, 'site-instructions', 'Use gate C after 09:00.');
        await page.locator('#reload-site').click();
        await page.waitForFunction(() => document.querySelector('#site-revision')?.textContent.endsWith('2'));
        await page.locator('#contact-name input').waitFor();
        await page.locator('#site-city input').waitFor();
        assert.equal(await page.locator('#contact-name input').inputValue(), 'Sam Taylor');
        assert.equal(await page.locator('#site-city input').inputValue(), 'Bath');
        assert.equal(await page.locator('#instructions-summary').textContent(), 'Use gate C after 09:00.');
        assert.deepEqual(await page.evaluate(() => [window.gramlot.data.getItem('visit.site.contact.name'),
            window.gramlot.data.getItem('visit.site.address.city')]), ['Sam Taylor', 'Bath']);
    },
};

groupletBehaviors.g05 = async page => {
    await page.locator('#actions-contact input').waitFor();
    await page.locator('#actions-delivery .card-actions').first().click();
    await page.locator('#actions-morning').click();
    assert.equal(await page.locator('#actions-window input').inputValue(),'Tuesday, 09:00–12:00');
    await edit(page,'actions-address-city','Bath');
    await page.locator('#actions-reload').click();
    await page.locator('#actions-revision').filter({hasText:'2'}).waitFor();
    await page.locator('#actions-address-city input').waitFor();
    assert.equal(await page.locator('#actions-address-city input').inputValue(),'Bath');
};
groupletBehaviors.g06 = async page => {
    await page.locator('#guide-customer-contact input').waitFor();
    await edit(page,'guide-customer-contact','Sam Taylor');
    await page.locator('#guide-delivery .card-doc-button').first().click();
    await page.locator('#guide-delivery .card-doc-body').first().getByText('Sam Taylor',{exact:false}).waitFor();
    await page.locator('#guide-delivery .card-doc-close').first().click();
    await page.locator('#guide-reload').click();
    await page.locator('#guide-revision').filter({hasText:'2'}).waitFor();
    assert.equal(await page.locator('#guide-customer-contact input').inputValue(),'Sam Taylor');
};
