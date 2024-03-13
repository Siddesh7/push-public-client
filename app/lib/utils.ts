export interface FrameDetails {
  image: string;
  siteURL: string;
  postURL: string;
  buttons: {index: string; content: string; action?: string; target?: string}[];
  input?: {name: string; content: string};
}
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

function getFormattedMetadata(URL: string, data: any) {
  const frameDetails: FrameDetails = {
    image: "",
    siteURL: URL,
    postURL: "",
    buttons: [],
    input: {name: "", content: ""},
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const metaElements: NodeListOf<HTMLMetaElement> =
    doc.head.querySelectorAll("meta");

  metaElements.forEach((element, index) => {
    const name =
      element.getAttribute("name") || element.getAttribute("property");
    const content = element.getAttribute("content");

    if (name && content) {
      if (name === "fc:frame:image") {
        frameDetails.image = content;
      } else if (name === "fc:frame:post_url") {
        frameDetails.postURL = content;
      } else if (
        name.includes("fc:frame:button") &&
        !name.includes("action") &&
        !name.includes("target")
      ) {
        const index = name.split(":")[3];
        const indexZeroExists = frameDetails.buttons.some(
          (button) => button.index === index
        );
        if (!indexZeroExists) {
          frameDetails.buttons.push({
            index: index,
            content: content,
            action: "",
            target: "",
          });
        } else {
          const indexToUpdate = frameDetails.buttons.findIndex(
            (button) => button.index === String(index)
          );
          frameDetails.buttons[indexToUpdate].content = content;
          frameDetails.buttons[indexToUpdate].index = index;
        }
      } else if (name === "fc:frame:input:text") {
        frameDetails.input = {name, content};
      } else if (
        name.includes("fc:frame:button:") &&
        name.includes(":action")
      ) {
        const number = name.split(":")[3];
        const indexZeroExists = frameDetails.buttons.some(
          (button) => button.index === number
        );
        if (!indexZeroExists) {
          frameDetails.buttons.push({
            index: number,
            content: "",
            action: content,
            target: "",
          });
        } else {
          const indexToUpdate = frameDetails.buttons.findIndex(
            (button) => button.index === number
          );
          frameDetails.buttons[indexToUpdate].action = content;
        }
      } else if (
        name.includes("fc:frame:button:") &&
        name.includes(":target")
      ) {
        const number = name.split(":")[3];

        const indexZeroExists = frameDetails.buttons.some(
          (button) => button.index === number
        );

        if (!indexZeroExists) {
          frameDetails.buttons.push({
            index: number,
            content: "",
            action: "",
            target: content,
          });
        } else {
          const indexToUpdate = frameDetails.buttons.findIndex(
            (button) => button.index === number
          );

          frameDetails.buttons[indexToUpdate].target = content;
        }
      }
    }
  });

  return frameDetails;
}
function extractWebLink(text: string) {
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}(?:\:[0-9]{1,5})?\/(?:[\w#!:.?+=&%!\-\/])*(?:\[[^\/]*\]|(?:[^\s\[]*))?/i;
  const match = text.match(urlRegex);
  return match ? match[0] : "";
}

function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
export {
  getHostname,
  hasWebLink,
  removeWebLink,
  getFormattedMetadata,
  extractWebLink,
  truncateAddress,
};
