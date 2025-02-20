import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, click } from '@ember/test-helpers';

module('modifier', 'Integration | Modifier | on-click-outside', function(hooks) {
  setupRenderingTest(hooks);

  test('smoke test', async function(assert) {
    assert.expect(2);

    this.set('didClickOutside', (e)=> {
      assert.ok('`didClickOutside` fired only once');
      assert.equal(e.target.className, 'outside', 'the event object was passed and is correct');
    });

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div {{on-click-outside (action didClickOutside)}} class="inside">We're in</div>
    `);

    await click('.inside');
    await click('.outside');
  });

  test('real-world scenario', async function(assert) {
    this.isOpened = false;

    this.open = () => {
      this.set('isOpened', true);
    };

    this.close = () => {
      assert.ok(true, 'The close handler was called');
      this.set('isOpened', false);
    };

    await render(hbs`
      <button data-test-open onclick={{action this.open}}>
        Toggle popover
      </button>

      <div data-test-outside>Outside</div>

      {{#if this.isOpened}}
        <div {{on-click-outside (action this.close)}}>
          Popover is opened.
        </div>
      {{/if}}
    `);

    await click('[data-test-open]');
    await click('[data-test-outside]');
  });


  test(`it doesn't throw without a handler`, async function(assert) {
    assert.expect(0);

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div {{on-click-outside}} class="inside">We're in</div>
    `);

    await click('.outside');
  });

  test('except selector', async function(assert) {
    assert.expect(1);

    this.set('didClickOutside', ()=> {
      assert.ok('`didClickOutside` fired only once');
    });

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div class="except-outside">
        Somewhere, under the rainbow...
      </div>

      <div
        {{on-click-outside (action didClickOutside)
          exceptSelector=".except-outside"
        }}
      ></div>
    `);

    await click('.outside');
    await click('.except-outside');
  });

  test('handle removed DOM element outside', async function(assert) {
    assert.expect(1);

    this.set('didClickOutside', () => {
      assert.ok('`didClickOutside` fired only once');
    });

    this.set('toggleFlag', () => {
      this.set('topSide', true);
    });

    await render(hbs`
      {{#if topSide}}
        Blue
      {{else}}
        <div class="outside" {{action "toggleFlag"}}>Yellow</div>
      {{/if}}

      <div {{on-click-outside (action didClickOutside)}}></div>
    `);

    await click('.outside');
  });
});
