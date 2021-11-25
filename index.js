$(function () {
  let inProgress = false;
  $("#file-dragger-text").text("Click Or Drag File Here");
  function setLoading(state) {
    if (state) {
      // loading stuff
      $("#file-dragger-text").text("Stand By...");
      inProgress = true;
    } else {
      // no longer loading stuff
      inProgress = false;
      $("#file-dragger-text").text("Click Or Drag File Here");
    }
  }

  const handleFileConversion = async (f) => {
    if (!f) return alert("No file was found.");
    if (inProgress) return alert("File conversion in progress.");
    setLoading(true);
    try {
      const filenameParts = f.name.split(".");
      if (!filenameParts.length) return alert("No filename was found.");
      const ext = filenameParts.pop();
      if (ext.toLowerCase() !== "xlsb") return alert("Invalid file type.");
      const filename = filenameParts.join(".");
      const data = await f.arrayBuffer();
      const workbook = XLSX.read(data);
      XLSX.writeFile(workbook, filename + ".xlsx");
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred converting your file: " +
          (error.message ? error.message : "Unknown Error")
      );
    }
    setLoading(false);
  };
  $("#file-dragger").on("click", function (e) {
    $("#file-input").click();
  });
  /** https://stackoverflow.com/a/9545050/10290918  */
  $("#file-dragger").on("dragover dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
  $("#file-dragger").on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    handleFileConversion(e?.originalEvent?.dataTransfer?.files?.[0]);
  });
  $("#file-input").on("change", (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileConversion(e?.target?.files?.[0]);
  });
});
