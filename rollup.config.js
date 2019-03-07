import include from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default ['umd', 'esm'].map(module => { return {
    input: 'build/src/index.js',
    output: {
        name: 'typtap',
        file: `dist/typtap.${module}.js`,
        format: module
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
}});
