import RequireContext = __WebpackModuleApi.RequireContext;

Error.stackTraceLimit = Infinity;

function requireAll(ctx: RequireContext): void {
    ctx.keys().forEach(ctx);
}

requireAll(require.context('./unit', true, /\.spec\.ts$/));
