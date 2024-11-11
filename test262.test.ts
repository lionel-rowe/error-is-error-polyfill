#!/usr/bin/env -S deno test -A --watch

import { walk } from '@std/fs'

async function getCode(testPath: string) {
	let code = ''

	for (
		const [fileName, idents] of [
			['assert.js', ['assert']],
			['isConstructor.js', ['isConstructor']],
			['sta.js', ['Test262Error']],
			['propertyHelper.js', ['verifyProperty']],
		] as const
	) {
		code += `${await Deno.readTextFile(`./test262/harness/${fileName}`)}\n${
			idents.map((ident) => `globalThis.${ident} = ${ident}`).join('\n')
		}\n`
	}

	code += `await import('./polyfill.ts')\n`
	code += `await import('./${testPath}')\n`

	return code
}

const ignoredTests = [
	'non-error-objects-other-realm.js',
	'errors-other-realm.js',
	'fake-errors.js',
]

Deno.test('Error.isError', async (t) => {
	for await (const entry of walk('./test262/test/built-ins/Error/isError/')) {
		if (entry.isFile && !ignoredTests.includes(entry.name)) {
			await t.step(entry.name, async () => {
				await new Deno.Command(Deno.execPath(), {
					args: ['eval', await getCode(entry.path)],
					cwd: Deno.cwd(),
				}).spawn().output()
			})
		}
	}
})
