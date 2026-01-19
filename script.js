"use strict";


let grid = [];
for (let r = 0; r < 9; r++) {
  let row = [];
  for (let c = 0; c < 9; c++) row.push(undefined);
  grid.push(row);
}

document.addEventListener("DOMContentLoaded", function () {
  const boardEl = document.getElementById("board");
  const controlsEl = document.getElementById("controls");
  const statusEl = document.getElementById("status");

  let checkBtn = null;        
  let hasCheckedOnce = false;   

  
  let invalidRows = new Set();
  let invalidCols = new Set();

  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.textContent = "";

      cell.addEventListener("click", function () {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        
        let v = grid[row][col];
        if (v === undefined) v = 1;
        else v = v + 1;

        if (v === 10) v = undefined;

        
        grid[row][col] = v;
        cell.textContent = (v === undefined) ? "" : String(v);


        if (hasCheckedOnce) {
          clearRowHighlight(row);
          clearColHighlight(col);
          invalidRows.delete(row);
          invalidCols.delete(col);
          statusEl.textContent = "Edited. You can press Check again.";
        }

    
        updateCheckButtonVisibility();
      });

      boardEl.appendChild(cell);
    }
  }

  function isBoardFull() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === undefined) return false;
      }
    }
    return true;
  }

  function updateCheckButtonVisibility() {
    if (isBoardFull()) {
      
      if (checkBtn === null) {
        checkBtn = document.createElement("button");
        checkBtn.id = "checkBtn";
        checkBtn.type = "button";
        checkBtn.textContent = "Check";
        controlsEl.appendChild(checkBtn);

        checkBtn.addEventListener("click", function () {
          hasCheckedOnce = true;
          runValidation();
        });
      }
      statusEl.textContent = "All cells filled. Click Check.";
    } else {
    
      if (checkBtn !== null) {
        controlsEl.removeChild(checkBtn);
        checkBtn = null;
      }

      
      clearAllHighlights();
      invalidRows.clear();
      invalidCols.clear();
      hasCheckedOnce = false;

      statusEl.textContent = "Fill all cells to show the Check button.";
    }
  }

  
  function getCellEl(row, col) {
    return boardEl.querySelector('.cell[data-row="' + row + '"][data-col="' + col + '"]');
  }

  function clearAllHighlights() {
    const all = boardEl.querySelectorAll(".cell");
    all.forEach(function (cell) {
      cell.classList.remove("error");
    });
  }

  function highlightRow(row) {
    for (let c = 0; c < 9; c++) {
      getCellEl(row, c).classList.add("error");
    }
  }

  function highlightCol(col) {
    for (let r = 0; r < 9; r++) {
      getCellEl(r, col).classList.add("error");
    }
  }

  function clearRowHighlight(row) {
    for (let c = 0; c < 9; c++) {
      getCellEl(row, c).classList.remove("error");
    }
  }

  function clearColHighlight(col) {
    for (let r = 0; r < 9; r++) {
      getCellEl(r, col).classList.remove("error");
    }
  }

  function unitIsValid(values) {
    
    
    const set = new Set();
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (v === undefined) return false;
      if (typeof v !== "number") return false;
      if (v < 1 || v > 9) return false;
      set.add(v);
    }
    return set.size === 9;
  }

  function runValidation() {
    clearAllHighlights();
    invalidRows.clear();
    invalidCols.clear();

    let ok = true;

    
    for (let r = 0; r < 9; r++) {
      const rowVals = [];
      for (let c = 0; c < 9; c++) rowVals.push(grid[r][c]);
      if (!unitIsValid(rowVals)) {
        ok = false;
        invalidRows.add(r);
      }
    }

    
    for (let c = 0; c < 9; c++) {
      const colVals = [];
      for (let r = 0; r < 9; r++) colVals.push(grid[r][c]);
      if (!unitIsValid(colVals)) {
        ok = false;
        invalidCols.add(c);
      }
    }

    

    
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const values = [];
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            values.push(grid[r][c]);
          }
        }
        if (!unitIsValid(values)) ok = false;
      }
    }

    
    invalidRows.forEach(function (r) { highlightRow(r); });
    invalidCols.forEach(function (c) { highlightCol(c); });

    statusEl.textContent = ok
      ? "✅ Correct Sudoku!"
      : "❌ Incorrect. Invalid rows/columns highlighted in red. Edit and Check again.";
  }

  
  updateCheckButtonVisibility();
});
