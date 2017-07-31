const stuff = (map, key, it) => {
    map[key] = it;
    return map;
}

export default (data, keySelector) => {
    if (!data.reduce)
        throw new Error("Data must be reducable");

    return data.reduce((dict, it) => stuff(dict, keySelector(it), it), {});
}
