import { readFileSync } from 'fs';
import include from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'build/src/test.js',
    output: {
        name: 'typtap',
        file: 'build/src/bundle.js',
        format: 'esm',
        footer: readFileSync('./scripts/exports.js', { encoding: 'utf-8' })
    },
    plugins: [
        include({
            paths: [
                'build/src'
            ]
        }),
        resolve(),
        commonjs()
    ]
}
