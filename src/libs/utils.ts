function randStr(length: number, prefix: string = ""): string {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return prefix + result;
}

function chunkSubstr(str, size) {
  return str.match(new RegExp(".{1," + size + "}", "g"));
}

function getOS() {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
}
const fuzzyMatch = (strA: string, strB: string, fuzziness = 0) => {
  if (strA === "" || strB === "") {
    return false;
  }

  if (strA === strB) return true;

  const { largest, smallest } = findLargestSmallest(strA, strB);
  const maxIters = largest.length - smallest.length;
  const minMatches = smallest.length - fuzziness;

  for (let i = 0; i < maxIters; i++) {
    let matches = 0;
    for (let smIdx = 0; smIdx < smallest.length; smIdx++) {
      if (smallest[smIdx] === largest[smIdx + i]) {
        matches++;
      }
    }
    if (matches > 0 && matches >= minMatches) {
      return true;
    }
  }

  return false;
};
export { randStr, chunkSubstr, getOS, fuzzyMatch };
