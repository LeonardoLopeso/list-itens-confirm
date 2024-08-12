function sortItems(items) {
    return items.sort((a, b) => {
        const cleanTextA = a.text.replace(/^\d+\s/, '');
        const cleanTextB = b.text.replace(/^\d+\s/, '');
        return cleanTextA.localeCompare(cleanTextB);
    });
}

export { sortItems }