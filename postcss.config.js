module.exports = {
    plugins: {
        'cssnano': {
            preset: [
                'advanced',
                {
                    autoprefixer: {
                        add: true,
                        remove: false
                    }
                }
            ]
        }
    }
};
