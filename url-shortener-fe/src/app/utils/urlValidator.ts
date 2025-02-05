export const urlRegex =
    /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?(\?[^\s]*)?(#[^\s]*)?$/;

export const isValidUrl = (url: string): boolean => {
    return urlRegex.test(url);
};
