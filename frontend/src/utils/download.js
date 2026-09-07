export async function downloadFile(axiosPromise, fallbackName) {
  const res = await axiosPromise;
  const blob = new Blob([res.data]);
  const cd = res.headers?.["content-disposition"] || "";
  const match = cd.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : fallbackName;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
