const defaultSteps = [
  { title: "既存取引", condition: "既存取引有無 > 0", result: "既存取引あり", color: "#2f6fdf" },
  { title: "他事業所取引", condition: "他事業所取引有無 > 0", result: "他事業所取引あり", color: "#3ca55a" },
  { title: "親子/系列", condition: "親子関係取引有無 > 0 または 系列内取引有無 > 0", result: "系列内取引あり", color: "#7352cc" },
  { title: "その他", condition: "上記すべてが 0", result: "取引なし", color: "#7b7b7b" }
];

const stepsEl = document.getElementById("steps");
const preview = document.getElementById("preview");

function addStepRow(step = { title: "", condition: "", result: "", color: "#2f6fdf" }) {
  const tpl = document.getElementById("step-template").content.cloneNode(true);
  const row = tpl.querySelector(".step-row");
  row.querySelector(".step-title").value = step.title;
  row.querySelector(".step-condition").value = step.condition;
  row.querySelector(".step-result").value = step.result;
  row.querySelector(".step-color").value = step.color;
  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    renderPreview();
  });
  row.querySelectorAll("input").forEach((input) => input.addEventListener("input", renderPreview));
  stepsEl.appendChild(row);
}

function readSteps() {
  return [...stepsEl.querySelectorAll(".step-row")].map((row) => ({
    title: row.querySelector(".step-title").value,
    condition: row.querySelector(".step-condition").value,
    result: row.querySelector(".step-result").value,
    color: row.querySelector(".step-color").value
  }));
}

function renderPreview() {
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;
  const steps = readSteps();

  preview.innerHTML = "";
  const ns = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs = {}) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  preview.append(mk("rect", { x: 0, y: 0, width: 1280, height: 720, fill: "#fff" }));
  preview.append(mk("text", { x: 640, y: 60, "text-anchor": "middle", "font-size": 52, "font-weight": "700", fill: "#113f94" })).textContent = title;
  preview.append(mk("rect", { x: 380, y: 90, width: 520, height: 56, rx: 28, fill: "#133f95" }));
  preview.append(mk("text", { x: 640, y: 128, "text-anchor": "middle", "font-size": 34, "font-weight": "700", fill: "#fff" })).textContent = subtitle;

  const startY = 180;
  const boxW = 1180;
  const boxH = 500;
  preview.append(mk("rect", { x: 50, y: startY, width: boxW, height: boxH, rx: 12, fill: "#f9fbff", stroke: "#2858b3", "stroke-width": 3 }));

  steps.forEach((step, i) => {
    const y = startY + 28 + i * 108;
    preview.append(mk("circle", { cx: 92, cy: y + 26, r: 24, fill: "#2b63cf" }));
    preview.append(mk("text", { x: 92, y: y + 34, "text-anchor": "middle", "font-size": 28, "font-weight": "700", fill: "#fff" })).textContent = String(i + 1);
    preview.append(mk("rect", { x: 130, y, width: 560, height: 52, rx: 10, fill: "#fff", stroke: step.color, "stroke-width": 2 }));
    preview.append(mk("text", { x: 152, y: y + 34, "font-size": 30, "font-weight": "700", fill: step.color })).textContent = step.title;

    preview.append(mk("rect", { x: 705, y, width: 460, height: 52, rx: 10, fill: step.color }));
    preview.append(mk("text", { x: 935, y: y + 34, "text-anchor": "middle", "font-size": 28, "font-weight": "700", fill: "#fff" })).textContent = step.result;

    preview.append(mk("text", { x: 152, y: y + 86, "font-size": 26, fill: "#1a1a1a" })).textContent = step.condition;
  });
}

function downloadPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  const slide = pptx.addSlide();
  const title = document.getElementById("title").value;
  const subtitle = document.getElementById("subtitle").value;
  const steps = readSteps();

  slide.addText(title, { x: 0.3, y: 0.1, w: 12.7, h: 0.6, align: "center", bold: true, fontSize: 30, color: "113F94" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 4.0, y: 0.7, w: 5.3, h: 0.52, rectRadius: 0.2, fill: { color: "133F95" }, line: { color: "133F95" } });
  slide.addText(subtitle, { x: 4.0, y: 0.76, w: 5.3, h: 0.35, align: "center", bold: true, fontSize: 18, color: "FFFFFF" });

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.35, w: 12.7, h: 5.8, rectRadius: 0.08, fill: { color: "F9FBFF" }, line: { color: "2858B3", pt: 1.5 } });

  steps.forEach((step, i) => {
    const y = 1.65 + i * 1.2;
    const c = step.color.replace("#", "").toUpperCase();
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.5, y, w: 0.4, h: 0.4, fill: { color: "2B63CF" }, line: { color: "2B63CF" } });
    slide.addText(String(i + 1), { x: 0.5, y: y + 0.07, w: 0.4, h: 0.2, align: "center", bold: true, fontSize: 14, color: "FFFFFF" });

    slide.addShape(pptx.ShapeType.roundRect, { x: 1.0, y, w: 6.1, h: 0.43, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: c, pt: 1 } });
    slide.addText(step.title, { x: 1.15, y: y + 0.08, w: 5.7, h: 0.2, bold: true, fontSize: 16, color: c });

    slide.addShape(pptx.ShapeType.roundRect, { x: 7.3, y, w: 5.2, h: 0.43, rectRadius: 0.06, fill: { color: c }, line: { color: c } });
    slide.addText(step.result, { x: 7.3, y: y + 0.08, w: 5.2, h: 0.2, align: "center", bold: true, fontSize: 15, color: "FFFFFF" });
    slide.addText(step.condition, { x: 1.15, y: y + 0.56, w: 11.35, h: 0.3, fontSize: 13, color: "222222" });
  });

  pptx.writeFile({ fileName: "diagram-export.pptx" });
}

document.getElementById("title").addEventListener("input", renderPreview);
document.getElementById("subtitle").addEventListener("input", renderPreview);
document.getElementById("add-step").addEventListener("click", () => {
  addStepRow();
  renderPreview();
});
document.getElementById("download").addEventListener("click", downloadPptx);

defaultSteps.forEach(addStepRow);
renderPreview();
