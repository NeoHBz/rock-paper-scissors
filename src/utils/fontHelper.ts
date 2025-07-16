const enableCustomFont = true;

const fontHelper = (fontClassName: string) => {
  return enableCustomFont ? fontClassName : "";
};

export default fontHelper;
