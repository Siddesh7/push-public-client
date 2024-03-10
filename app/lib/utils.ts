function getHostname(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    // Handle invalid URL or other errors gracefully
    console.error("Error parsing URL:", error);

    // Fallback for non-standard URLs (without protocol or leading slashes)
    const match = url.match(/^(?:https?:\/\/)?([^/?]+)/);
    if (match) {
      return match[1];
    }

    return ""; // Or throw an error if you prefer
  }
}

function hasWebLink(text: string): boolean {
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}(?:\:[0-9]{1,5})?\/(?:[\w#!:.?+=&%!\-\/])*(?:\[[^\/]*\]|(?:[^\s\[]*))?/i;
  return urlRegex.test(text);
}
function removeWebLink(text: string): string {
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}(?:\:[0-9]{1,5})?\/(?:[\w#!:.?+=&%!\-\/])*(?:\[[^\/]*\]|(?:[^\s\[]*))?/gi;
  return text.replace(urlRegex, "");
}

export {getHostname, hasWebLink, removeWebLink};
