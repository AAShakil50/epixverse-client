const truncate = (text: string, maxLength: number, pad: string = " ...") => {
  return text.length > maxLength ? text.substring(0, maxLength) + pad : text;
};

export { truncate };
