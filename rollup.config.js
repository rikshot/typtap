import include from 'rollup-plugin-includepaths';

export default {
    input: 'build/src/test.js',
    output: {
        name: 'typtap',
        file: 'build/src/bundle.js',
        format: 'esm'
    },
    plugins: [
        include({
            paths: [
                'build/src',
                'build/test'
            ]
        })
    ]
}
