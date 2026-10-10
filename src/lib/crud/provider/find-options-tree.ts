/** TypeORM 1.x accepts only object-form `select`/`relations`; converts dotted paths like ['a', 'a.b'] into `{ a: { b: true } }` */
export function toFindOptionsTree<T>(paths: string[]): T {
    const tree: Record<string, unknown> = {};
    for (const path of paths) {
        if (typeof path !== 'string') {
            continue;
        }
        const keys = path.split('.');
        let node = tree;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                if (typeof node[key] !== 'object' || node[key] === null) {
                    node[key] = true;
                }
                return;
            }
            if (typeof node[key] !== 'object' || node[key] === null) {
                node[key] = {};
            }
            node = node[key] as Record<string, unknown>;
        });
    }
    return tree as T;
}
