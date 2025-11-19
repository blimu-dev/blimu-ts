"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
exports.listAll = listAll;
async function* paginate(fetchPage, initialQuery = {}, pageSize = 100) {
    let offset = Number(initialQuery.offset ?? 0);
    const limit = Number(initialQuery.limit ?? pageSize);
    const baseQuery = { ...initialQuery };
    while (true) {
        const page = await fetchPage({ ...baseQuery, limit, offset });
        const items = page.data ?? [];
        for (const item of items) {
            yield item;
        }
        if (!page.hasMore || items.length < limit)
            break;
        offset += limit;
    }
}
async function listAll(fetchPage, query = {}, pageSize = 100) {
    const out = [];
    for await (const item of paginate(fetchPage, query, pageSize))
        out.push(item);
    return out;
}
//# sourceMappingURL=utils.js.map