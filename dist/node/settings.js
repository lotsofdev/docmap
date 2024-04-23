import { __commonTextFileExtensions } from '@lotsof/sugar/extension';
export default {
    build: {
        globs: [
            '*',
            `src/!(css)/**/*.+(${__commonTextFileExtensions({}).join('|')})`,
            `dist/+(css)/*`,
        ],
        exclude: [],
        excludeByTags: {
            status: [/^(?!stable)([a-z0-9]+)$/],
            type: [/^CssClass$/],
        },
        tags: [
            'id',
            'name',
            'as',
            'type',
            'param',
            'return',
            'setting',
            'menu',
            'default',
            'platform',
            'description',
            'namespace',
            'status',
            'snippet',
            'example',
            'install',
            'interface',
            'async',
            'static',
            'since',
            'author',
        ],
        save: true,
        outPath: `${process.cwd()}/docmap.json`,
    },
};
//# sourceMappingURL=settings.js.map