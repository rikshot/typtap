import include from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'build/test/all.js',
    output: {
        name: 'typtap',
        file: 'build/test/bundle.js',
        format: 'esm'
    },
    plugins: [
        include({
            paths: [
                'build/src',
                'build/test'
            ]
        }),
        resolve(),
        commonjs()
    ]
}
