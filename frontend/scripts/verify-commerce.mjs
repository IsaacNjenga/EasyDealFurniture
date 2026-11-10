import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { compileModule } from 'svelte/compiler';

const url = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const transpile = (source) =>
	ts.transpileModule(source, {
		compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
	}).outputText;
const commerceUrl = url(
	transpile(await readFile(new URL('../src/lib/commerce.ts', import.meta.url), 'utf8'))
);
const { unitPrice, categoryName } = await import(commerceUrl);
assert.equal(unitPrice({ price: 10000, discount: 15 }), 8500);
assert.equal(unitPrice({ price: 10000, discount: 150 }), 0);
assert.equal(unitPrice({ price: 10000, discount: -10 }), 10000);
assert.equal(categoryName(' Office Furniture '), 'Office');
assert.equal(categoryName('Second-Hand Items'), 'Second-hand');

const catalogueSource = transpile(
	await readFile(new URL('../src/lib/catalogue.ts', import.meta.url), 'utf8')
).replaceAll("'$lib/commerce'", JSON.stringify(commerceUrl));
const { matchesProduct } = await import(url(catalogueSource));
const chair = {
	_id: 'chair',
	name: 'Task Chair',
	slug: 'task-chair',
	price: 10000,
	discount: 15,
	image: ['https://example.com/chair.jpg'],
	category: 'Office Furniture',
	colours: ['Black'],
	tags: ['Ergonomic'],
	inStock: true
};
const filters = {
	category: 'Office',
	colour: 'black',
	query: 'ERGONOMIC',
	minPrice: 8000,
	maxPrice: 9000,
	availability: 'stock'
};
assert.equal(
	matchesProduct(chair, filters),
	true,
	'Combined filters use the discounted price and case-insensitive tags/colours'
);
assert.equal(matchesProduct(chair, { ...filters, maxPrice: 8000 }), false);
assert.equal(
	matchesProduct({ ...chair, inStock: undefined }, filters),
	false,
	'Unknown stock must not be advertised as confirmed'
);
assert.equal(matchesProduct(chair, { ...filters, colour: 'blue' }), false);
assert.equal(
	matchesProduct(chair, { ...filters, colour: 'blue' }, 'colour'),
	true,
	'Facet counts ignore their own selection'
);
assert.equal(matchesProduct(chair, { ...filters, minPrice: 10000, maxPrice: 8000 }), false);

const storage = new Map();
globalThis.localStorage = {
	getItem: (key) => storage.get(key) ?? null,
	setItem: (key, value) => storage.set(key, value)
};
let quoteSource = transpile(
	await readFile(new URL('../src/lib/stores/quote.svelte.ts', import.meta.url), 'utf8')
)
	.replaceAll("'$lib/commerce'", JSON.stringify(commerceUrl))
	.replace(/import \{ toast \} from 'svelte-sonner';/, 'const toast = { success() {} };');
quoteSource = compileModule(quoteSource, {
	filename: 'quote.svelte.js',
	generate: 'client'
}).js.code.replaceAll(
	"'svelte/internal/client'",
	JSON.stringify(import.meta.resolve('svelte/internal/client'))
);
const { quote } = await import(url(quoteSource));
quote.init();
quote.add(chair);
quote.add(chair);
assert.equal(quote.items.length, 1);
assert.deepEqual(quote.items[0].image, chair.image);
assert.equal(quote.count, 2);
assert.equal(quote.total, 17000);
quote.update('chair', 3);
assert.equal(quote.total, 25500);
quote.update('chair', NaN);
assert.equal(quote.count, 3);
quote.update('chair', -2);
assert.equal(quote.count, 1);
quote.update('chair', 1000);
assert.equal(quote.count, 999);
quote.items = [];
quote.initialized = false;
quote.init();
assert.equal(quote.count, 999, 'Quote survives a new session');
quote.add({ ...chair, price: 20000 });
assert.equal(quote.items[0].price, 17000, 'Adding an existing item refreshes its saved price');
quote.remove('chair');
assert.equal(quote.total, 0);
quote.add({ ...chair, image: 'https://example.com/string-image.jpg' });
assert.deepEqual(quote.items[0].image, ['https://example.com/string-image.jpg']);
storage.set(
	'easydeal_quote_v1',
	JSON.stringify([
		{
			id: 'legacy',
			image: 'https://example.com/legacy-image.jpg',
			name: 'Legacy',
			slug: 'legacy',
			price: 100,
			quantity: 1
		}
	])
);
quote.initialized = false;
quote.init();
assert.deepEqual(quote.items[0].image, ['https://example.com/legacy-image.jpg']);
storage.set('easydeal_quote_v1', '[{"id":"bad","quantity":-1}]');
quote.initialized = false;
quote.init();
assert.equal(quote.count, 0);
storage.set('easydeal_quote_v1', '{bad');
quote.initialized = false;
quote.init();
assert.equal(quote.count, 0);
quote.clear();
assert.equal(storage.get('easydeal_quote_v1'), '[]');
console.log(
	'Passed: discount pricing, combined filters, facet counts, stock uncertainty, quote totals, quantity limits, persistence and corrupt storage.'
);
