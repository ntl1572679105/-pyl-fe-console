let chapterClear = () => {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  context.clearRect(0, 0, 200, 200);
}

export default chapterClear;
