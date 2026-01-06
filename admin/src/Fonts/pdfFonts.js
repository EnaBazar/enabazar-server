import pdfMake from "pdfmake/build/pdfmake";
import NotoSansBangla from "./NotoSansBangla-Regular.js"; // ttf ফন্ট

pdfMake.vfs = {
  "NotoSansBangla-Regular.ttf": NotoSansBangla,
};

pdfMake.fonts = {
  NotoSansBangla: {
    normal: "NotoSansBangla-Regular.ttf",
    bold: "NotoSansBangla-Regular.ttf",
    italics: "NotoSansBangla-Regular.ttf",
    bolditalics: "NotoSansBangla-Regular.ttf",
  },
};

export default pdfMake;
