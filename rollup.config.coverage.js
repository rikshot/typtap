import include from 'rollup-plugin-includepaths';
import istanbul from 'rollup-plugin-istanbul';

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
        istanbul({
            exclude: ['build/test/**/*.js']
        })
    ]
}
