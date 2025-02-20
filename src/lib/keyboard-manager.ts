type Handler = (event: KeyboardEvent) => void;

const keyboardManager = {
  handlers: new Set<Handler>(),
  subscribe: (handler: Handler) => keyboardManager.handlers.add(handler),
  unsubscribe: (handler: Handler) => keyboardManager.handlers.delete(handler),
};

if (typeof window !== "undefined") {
  document.addEventListener("keydown", (event) => {
    keyboardManager.handlers.forEach((handler) => handler(event));
  });
}

export default keyboardManager;
export { type Handler };
