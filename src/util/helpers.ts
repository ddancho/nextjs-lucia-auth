export function getErrorMessage(error: unknown) {
  let message: string = "";

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "messsage" in error) {
    message = String(error.messsage);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
}
