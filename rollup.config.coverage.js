import include from 'rollup-plugin-includepaths';
import istanbul from 'rollup-plugin-istanbul';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'build/test/all.js',
    output: {
        name: 'typtap',
        file: 'build/test/coverage.js',
        format: 'esm'
    },
    plugins: [
        include({
            paths: [
                'build/src',
                'build/test'
            ]
        }),
        istanbul({
            include: ['build/src/**/*.js']
        }),
        resolve(),
        commonjs()
    ]
}
