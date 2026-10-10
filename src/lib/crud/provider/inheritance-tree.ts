/** inheritance chain of an entity class, root last (TypeORM 1.x no longer exposes metadata-builder/MetadataUtils) */
export function getInheritanceTree(entity: Function): Function[] {
    const tree: Function[] = [entity];
    const getPrototypeOf = (object: Function): void => {
        const proto = Object.getPrototypeOf(object);
        if (proto?.name) {
            tree.push(proto);
            getPrototypeOf(proto);
        }
    };
    getPrototypeOf(entity);
    return tree;
}
