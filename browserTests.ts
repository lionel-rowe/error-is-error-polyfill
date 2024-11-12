import { join } from '@std/path'
import { serveFile } from '@std/http/file-server'
import { walk } from '@std/fs/walk'

const testFilePaths = (await Array.fromAsync(walk('./test262/test/built-ins/Error/isError/')))
	.filter((entry) => entry.isFile)
	.map((entry) => entry.path)
	.sort((a, b) => {
		// prop-desc last as it deletes the prop
		return a.endsWith('/prop-desc.js') ? 1 : b.endsWith('/prop-desc.js') ? -1 : 0
	})

await using esbuild = await (async () => {
	const mod = await import('esbuild')

	return Object.assign({ ...mod }, {
		[Symbol.asyncDispose]() {
			return mod.stop()
		},
	})
})()

await Deno.mkdir('./temp/', { recursive: true })

const polyfillPath = './temp/polyfill.js'

await esbuild.build({
	entryPoints: ['./polyfill.ts'],
	bundle: true,
	outfile: polyfillPath,
})

const testFixturesPath = './temp/fixtures.js'

await esbuild.build({
	entryPoints: ['./_fixtures.ts'],
	bundle: true,
	format: 'esm',
	outfile: testFixturesPath,
})

Deno.serve((req) => {
	const { pathname } = new URL(req.url)

	if (pathname === '/') {
		return new Response(
			`<!DOCTYPE html>
			<html>
				<head>
					<title>Test262 Error.isError</title>
				</head>
				<body>
					<h1>Test262 Error.isError</h1>

					<script src="test262/harness/assert.js"></script>
					<script src="test262/harness/isConstructor.js"></script>
					<script src="test262/harness/sta.js"></script>
					<script src="test262/harness/propertyHelper.js"></script>

					<script>
						window.p = Promise.withResolvers()
					</script>

					<script type="module">
						import ${JSON.stringify(polyfillPath)}

						import { ERRORS, NON_ERRORS } from ${JSON.stringify(testFixturesPath)}
						globalThis.ERRORS = ERRORS
						globalThis.NON_ERRORS = NON_ERRORS

						if (!globalThis.$262) {
							const iframe = document.createElement('iframe')
							iframe.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))
							iframe.style.position = 'absolute'
							document.body.append(iframe)

							await new Promise((res) => iframe.contentWindow.addEventListener('DOMContentLoaded', res))

							globalThis.$262 = { createRealm: () => ({ global: iframe.contentWindow }) }
						}

						window.p.resolve()
					</script>

					<script type="module">
						await window.p.promise

						const failed = []

						function checkError(items, expected, name) {
							try {
								for (const item of items) {
									assert.sameValue(Error.isError(item), expected)
								}
							} catch {
								failed.push(name)
							}
						}

						checkError(ERRORS, true, 'ERRORS')
						checkError(NON_ERRORS, false, 'NON_ERRORS')

						for (const filePath of ${JSON.stringify(testFilePaths)}) {
							const script = document.createElement('script')
							script.src = filePath
							document.body.append(script)
							window.onerror = (e) => failed.push(filePath)
							await new Promise((res) => script.onload = res)
						}

						if (failed.length) {
							alert('failed tests: ' + JSON.stringify(failed))
						} else {
							alert('all tests passed!')
						}
					</script>
				</body>
			</html>
			`,
			{
				headers: {
					'content-type': 'text/html',
				},
			},
		)
	}

	return serveFile(req, join('.', pathname))
})
