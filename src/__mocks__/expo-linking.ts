export function createURL(url: string) {
    return url;
}

export function parse(url: string) {
    return { path: url };
}

export function resolveScheme() {
    return 'mock-scheme://';
}

export function addEventListener() {
    return { remove: jest.fn() };
}

export function getInitialURL() {
    return Promise.resolve(null);
}

export function openURL() {
    return Promise.resolve();
}

export function makeUrl() {
    return 'mock-url://';
}
