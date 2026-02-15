export function isURL(value) {
  if (!value) return false;
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain
    "localhost|" + // localhost
    "\\d{1,3}(\\.\\d{1,3}){3})" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-zA-Z\\d_]*)?$", "i" // fragment locator
  );
  return urlPattern.test(value);
}
