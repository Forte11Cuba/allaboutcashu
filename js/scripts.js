function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tbody tr");
  let count = 0;
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const show = text.includes(input);
    row.style.display = show ? "" : "none";
    if (show) count++;
  });
  document.getElementById("count").innerText = count + " result" + (count !== 1 ? "s" : "");
}

let currentSort = { tableId: null, col: null, dir: 'asc' };

function sortTable(n, isDate = false) {
  const table = event.target.closest("table"); // detecta la tabla desde el header clicado
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const ths = table.tHead.rows[0].cells;

  // Resetear clases de ordenamiento
  for (let th of ths) th.classList.remove("sort-asc", "sort-desc");

  // Dirección ascendente/descendente
  let dir = "asc";
  if (currentSort.tableId === table.id && currentSort.col === n && currentSort.dir === "asc") dir = "desc";
  currentSort = { tableId: table.id, col: n, dir };

  ths[n].classList.add(dir === "asc" ? "sort-asc" : "sort-desc");

  rows.sort((a, b) => {
    let x = a.cells[n].innerText.trim();
    let y = b.cells[n].innerText.trim();

    if (isDate) {
      x = new Date(x);
      y = new Date(y);
    } else {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }

    return dir === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
  });

  rows.forEach(row => tbody.appendChild(row));
}

function downloadCSV() {
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tr");
  let csv = [];
  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const data = [...cols].map(td => td.innerText.replace(/\n/g, " ").trim());
    csv.push(data.join(","));
  });

  const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cashu_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

