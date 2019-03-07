import include from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'build/test/all.js',
    output: {
        name: 'typtap',
        file: 'build/test/integration.js',
        format: 'umd',
        globals: {
            tap: 'typtap',
            test: 'typtap'
        }
    },
    plugins: [
        include({
            paths: [
                'build/test'
            ]
        }),
        resolve(),
        commonjs()
    ],
    external: [
        'tap',
        'test'
    ]
}
