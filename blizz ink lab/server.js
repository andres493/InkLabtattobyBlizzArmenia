const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, ".");
const port = process.env.PORT || 5001;
const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
http.createServer((req, res) => {
  let pathname = req.url.split("?")[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch (e) { /* url inválida: se usa tal cual */ }
  let file = path.join(root, pathname === "/" ? "index.html" : pathname);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log("INK LAB server en http://localhost:" + port));