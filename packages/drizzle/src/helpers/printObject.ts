export const printObject = (
  o: Record<string, string | number | boolean | string[]>
) => {
  let str = "{ ";
  const properties = Object.keys(o);
  properties.forEach((p, index) => {
    const isString = typeof o[p] === "string";
    if (isString) {
      str += `${p}: "${o[p].toString()}"`;
    } else if (Array.isArray(o[p])) {
      str += `${p}: ${JSON.stringify(o[p])}`;
    } else {
      str += `${p}: ${o[p].toString()}`;
    }

    if (index !== properties.length - 1) {
      str += ", ";
    }
  });

  str += " }";

  return str;
};
