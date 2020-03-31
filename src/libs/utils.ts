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

export { randStr, chunkSubstr };
