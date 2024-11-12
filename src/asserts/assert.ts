export function ASSERT(exprs: unknown, msg: string): asserts exprs {
  if (!exprs) {
    const message = `${msg} in ${__filename} file`;

    // server log
    console.log(message);

    throw new Error(message);
  }
}

export function isEnvValueNotEmptyString(value: unknown): value is string {
  if (typeof value === "string" && value !== "") {
    return true;
  }
  return false;
}
