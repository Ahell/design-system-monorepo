/**
 * Lit Table Components
 * Pure JavaScript implementation using Lit 3 from CDN
 *
 * Component:
 * - DataTable: Flexible data table with columns, formatters, sorting, and actions
 */

console.log(
  "🔵 ds-table.js module loaded - timestamp:",
  new Date().toISOString()
);

import { LitElement, html, css } from "lit";

/**
 * DataTable - Flexible data table component
 * @prop {Array} columns - Column definitions [{key, label, align, className, format}]
 * @prop {Array} data - Row data as array of objects
 * @prop {Object} footer - Optional footer row data {cells: [{content, colspan, className}]}
 * @prop {String} emptyMessage - Message when no data (default: "Inga data att visa")
 * @prop {Number} emptyColspan - Colspan for empty message (default: columns.length)
 * @prop {Boolean} sortable - Enable column sorting for all columns (default: false)
 * @prop {String} sortKey - Currently sorted column key
 * @prop {String} sortDirection - Sort direction: 'asc' | 'desc'
 * @prop {Function} rowClassName - Function to generate row class names
 * @fires row-click - Fired when a row is clicked {detail: {row, index}}
 * @fires sort-change - Fired when sort changes {detail: {key, direction}}
 */
class DataTable extends LitElement {
  static properties = {
    columns: { type: Array },
    data: { type: Array },
    footer: { type: Object },
    emptyMessage: { type: String, attribute: "empty-message" },
    emptyColspan: { type: Number, attribute: "empty-colspan" },
    sortable: { type: Boolean },
    // When true the table will perform client-side sorting of `data`.
    // When false the component will only emit `sort-change` and expect
    // the host to provide sorted data (server-side sorting).
    clientSort: { type: Boolean, attribute: "client-sort" },
    sortKey: { type: String, attribute: "sort-key" },
    sortDirection: { type: String, attribute: "sort-direction" },
    rowClassName: { type: Function },
    // Row selection
    selectable: { type: Boolean },
    selectionMode: { type: String, attribute: "selection-mode" }, // 'single' | 'multiple'
    selectedRows: { type: Array, attribute: "selected-rows" },
    // Loading state
    loading: { type: Boolean },
    loadingMessage: { type: String, attribute: "loading-message" },
    // Responsive behavior
    responsive: { type: Boolean },
    // Row actions
    rowActions: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      font-weight: var(--weight-normal);
      -webkit-font-smoothing: subpixel-antialiased;
      -moz-osx-font-smoothing: auto;
      text-rendering: optimizeLegibility;
      /* Ensure CSS variables are inherited */
      color: var(--color-text-primary);
      position: relative; /* For loading overlay positioning */
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-surface-primary);
      border: var(--border-width-thin) solid var(--color-border-primary);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      transition: var(--transition-all);
      overflow: hidden;
    }

    table:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--color-border-secondary);
    }

    thead {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    th {
      padding: var(--space-4);
      text-align: left;
      background: var(--color-success-main);
      border-bottom: var(--border-width-thin) solid
        var(--color-border-secondary);
      border-right: var(--border-width-thin) solid var(--color-border-primary);
      font-weight: var(--weight-semibold);
      color: var(--color-text-inverse);
      font-size: var(--text-sm);
      white-space: nowrap;
      box-shadow: var(--shadow-sm);
      position: relative;
    }

    th:last-child {
      border-right: none;
    }

    th.sortable {
      cursor: pointer;
      user-select: none;
      transition: var(--transition-colors);
    }

    th.sortable:hover {
      /* No hover effect - maintain original appearance */
    }

    th.right,
    td.right {
      text-align: right;
    }

    th.center,
    td.center {
      text-align: center;
    }

    .sort-indicator {
      display: inline-block;
      margin-left: var(--space-1);
      font-size: var(--text-xs);
      opacity: var(--opacity-60);
      transition: var(--transition-opacity);
      width: 0.75rem;
      text-align: center;
    }

    .sort-indicator.active {
      opacity: var(--opacity-100);
    }

    tbody tr {
      border-bottom: var(--border-width-thin) solid var(--color-border-primary);
      transition: var(--transition-colors);
      background: var(--color-surface-primary);
    }

    tbody tr:hover {
      background: var(--color-surface-secondary);
      box-shadow: var(--shadow-xs);
    }

    tbody tr.clickable {
      cursor: pointer;
    }

    tbody tr.clickable:hover {
      background: var(--color-surface-tertiary);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }

    td {
      padding: var(--space-4);
      color: var(--color-text-primary);
      white-space: nowrap;
      border-right: var(--border-width-thin) solid var(--color-border-primary);
    }

    td:last-child {
      border-right: none;
    }

    td.mono {
      /* Inherits font from :host */
    }

    td.fade {
      color: var(--color-text-tertiary);
    }

    td.wrap {
      white-space: normal;
    }

    td.amount {
      font-family: var(--font-mono);
      text-align: right;
    }

    /* Styling for sumpos/sumneg spans from fmtMoney */
    .sumpos {
      color: var(--color-success-main);
      font-weight: var(--weight-bold);
    }

    .sumneg {
      color: var(--color-danger-main);
      font-weight: var(--weight-bold);
    }

    .empty-state {
      text-align: center;
      padding: var(--space-10) var(--space-5);
      color: var(--color-text-tertiary);
      font-style: italic;
    }

    tfoot td {
      padding: var(--space-3);
      font-weight: var(--weight-semibold);
      border-top: var(--border-width-medium) solid var(--color-border-primary);
      background: var(--color-surface-secondary);
      color: var(--color-text-primary);
      white-space: nowrap;
    }

    tfoot td.wrap {
      white-space: normal;
    }

    tfoot .amount {
      font-family: var(--font-mono);
    }

    /* Selection */
    .selection-column {
      width: 40px;
      text-align: center;
    }

    .selection-checkbox {
      margin: 0;
    }

    /* Loading state */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-border-primary);
      border-top: 2px solid var(--color-primary-main);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Row actions */
    .actions-column {
      width: 120px;
    }

    .row-actions {
      display: flex;
      gap: var(--space-1);
      justify-content: center;
    }

    .row-action-btn {
      padding: var(--space-1);
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      transition: var(--transition-colors);
    }

    .row-action-btn:hover {
      background: var(--color-surface-secondary);
      color: var(--color-text-primary);
    }

    .row-action-btn:focus {
      outline: 2px solid var(--color-primary-main);
      outline-offset: -2px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      th,
      td {
        padding: var(--space-2) var(--space-2);
        font-size: var(--text-sm);
      }

      th {
        font-size: var(--text-xs);
      }

      /* Hide less important columns on mobile */
      .mobile-hidden {
        display: none;
      }

      /* Stack actions vertically on mobile */
      .row-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `;

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.footer = null;
    this.emptyMessage = "Inga data att visa";
    this.emptyColspan = 0;
    this.sortable = false;
    this.clientSort = true; // sensible default for local apps
    this.sortKey = "";
    this.sortDirection = "asc";
    this.rowClassName = null;
    // Row selection
    this.selectable = false;
    this.selectionMode = "single"; // 'single' | 'multiple'
    this.selectedRows = [];
    // Loading state
    this.loading = false;
    this.loadingMessage = "Loading...";
    // Responsive behavior
    this.responsive = true;
    // Row actions
    this.rowActions = [];
  }

  /**
   * Handle column header click for sorting
   */
  _handleHeaderClick(column) {
    console.log("🔴 Header clicked for column:", column.key, column);
    console.log(
      "🔴 this.sortable:",
      this.sortable,
      "this.clientSort:",
      this.clientSort
    );
    // Only allow sorting if table sorting is enabled and the column
    // hasn't explicitly disabled sorting (column.sortable === false)
    const isColumnSortable = column.sortable !== false;
    const canSort = this.sortable && isColumnSortable;
    console.log(
      "Can sort:",
      canSort,
      "table.sortable:",
      this.sortable,
      "column.sortable:",
      column.sortable,
      "isColumnSortable:",
      isColumnSortable
    );
    if (!canSort) {
      console.log("Sorting not allowed for column:", column.key);
      return;
    }

    let newDirection = "asc";
    if (this.sortKey === column.key) {
      newDirection = this.sortDirection === "asc" ? "desc" : "asc";
    }

    console.log("Sorting column:", column.key, "direction:", newDirection);
    this.sortKey = column.key;
    this.sortDirection = newDirection;

    // Emit event so host can react (server-side sorting) but also
    // perform client-side sorting when configured.
    this.dispatchEvent(
      new CustomEvent("sort-change", {
        detail: { key: column.key, direction: newDirection },
        bubbles: true,
        composed: true,
      })
    );

    if (this.clientSort) {
      console.log("Applying client-side sort");
      this._applySort();
    } else {
      console.log("Client sort disabled");
    }
  }

  _handleHeaderKey(e, column) {
    // Support keyboard activation for sorting (Enter / Space)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleHeaderClick(column);
    }
  }

  /**
   * Handle row selection
   */
  _handleRowSelect(row, index, checked) {
    if (!this.selectable) return;

    let newSelection = [...this.selectedRows];

    if (this.selectionMode === "single") {
      newSelection = checked ? [row] : [];
    } else {
      // Multiple selection
      if (checked) {
        if (
          !newSelection.find((r) => this._getRowId(r) === this._getRowId(row))
        ) {
          newSelection.push(row);
        }
      } else {
        newSelection = newSelection.filter(
          (r) => this._getRowId(r) !== this._getRowId(row)
        );
      }
    }

    this.selectedRows = newSelection;

    this.dispatchEvent(
      new CustomEvent("selection-change", {
        detail: {
          selectedRows: newSelection,
          selectionMode: this.selectionMode,
          changedRow: row,
          checked,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle select all checkbox
   */
  _handleSelectAll(checked) {
    if (!this.selectable || this.selectionMode !== "multiple") return;

    this.selectedRows = checked ? [...this.data] : [];

    this.dispatchEvent(
      new CustomEvent("selection-change", {
        detail: {
          selectedRows: this.selectedRows,
          selectionMode: this.selectionMode,
          selectAll: true,
          checked,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Get a unique identifier for a row (fallback to index if no id)
   */
  _getRowId(row) {
    return row.id || row._id || JSON.stringify(row);
  }

  /**
   * Check if a row is selected
   */
  _isRowSelected(row) {
    return this.selectedRows.some(
      (selected) => this._getRowId(selected) === this._getRowId(row)
    );
  }

  /**
   * Handle row action click
   */
  _handleRowAction(action, row, index) {
    this.dispatchEvent(
      new CustomEvent("row-action", {
        detail: {
          action: action.key,
          row,
          index,
          actionConfig: action,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Apply client-side sorting to `this.data` using current sortKey and direction.
   * Uses _getValue to support nested keys and handles numbers/strings/nulls.
   */
  _applySort() {
    if (!this.sortKey || !Array.isArray(this.data)) {
      console.log(
        "_applySort: No sortKey or data is not array",
        this.sortKey,
        this.data
      );
      return;
    }

    console.log(
      "_applySort: Sorting by",
      this.sortKey,
      "direction:",
      this.sortDirection
    );
    console.log(
      "_applySort: Original data sample:",
      this.data
        .slice(0, 3)
        .map((row) => ({ name: row.name, groupName: row.groupName }))
    );
    const key = this.sortKey;
    const dir = this.sortDirection === "asc" ? 1 : -1;

    const sorted = [...this.data].sort((a, b) => {
      const va = this._getValue(a, key);
      const vb = this._getValue(b, key);

      // Only log first few comparisons to avoid spam
      if (this.data.indexOf(a) < 3) {
        console.log(`Comparing "${va}" vs "${vb}" for key ${key}`);
      }

      // Normalize undefined/null
      if (va === undefined || va === null) return 1 * dir;
      if (vb === undefined || vb === null) return -1 * dir;

      // Numbers
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
        return (Number(va) - Number(vb)) * dir;
      }

      // Strings (locale-aware, case-insensitive)
      return (
        String(va).localeCompare(String(vb), undefined, {
          sensitivity: "base",
        }) * dir
      );
    });

    console.log(
      "_applySort: Sorted data sample:",
      sorted
        .slice(0, 3)
        .map((row) => ({ name: row.name, groupName: row.groupName }))
    );
    console.log(
      "_applySort: Data actually changed?",
      JSON.stringify(this.data.slice(0, 3)) !==
        JSON.stringify(sorted.slice(0, 3))
    );
    // Assign sorted data to trigger re-render
    this.data = sorted;
    console.log(
      "_applySort: After assignment, data sample:",
      this.data
        .slice(0, 3)
        .map((row) => ({ name: row.name, groupName: row.groupName }))
    );
    // Force update to ensure re-rendering
    this.requestUpdate("data");
    console.log("_applySort: requestUpdate('data') called");
  }

  /**
   * Handle row click
   */
  _handleRowClick(row, index) {
    this.dispatchEvent(
      new CustomEvent("row-click", {
        detail: { row, index },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Get value from row using column key (supports dot notation)
   */
  _getValue(row, key) {
    if (!key) return "";
    const keys = key.split(".");
    let value = row;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return "";
    }
    return value;
  }

  /**
   * Format cell value using column formatter
   * Returns either a string or a Lit template
   */
  _formatCell(row, column) {
    const value = this._getValue(row, column.key);
    if (column.format && typeof column.format === "function") {
      const formatted = column.format(value, row);
      // Return the formatted value as-is (could be string or Lit template)
      return formatted != null ? formatted : "";
    }
    return value != null ? String(value) : "";
  }

  /**
   * Get cell class name
   */
  _getCellClass(row, column) {
    const classes = [];

    if (column.align) classes.push(column.align);
    if (column.className) {
      if (typeof column.className === "function") {
        const dynamicClass = column.className(
          this._getValue(row, column.key),
          row
        );
        if (dynamicClass) classes.push(dynamicClass);
      } else {
        classes.push(column.className);
      }
    }

    // Add wrap class if column.wrap is true (allows text wrapping)
    if (column.wrap) classes.push("wrap");

    return classes.join(" ");
  }

  /**
   * Get row class name
   */
  _getRowClass(row, index) {
    if (this.rowClassName && typeof this.rowClassName === "function") {
      return this.rowClassName(row, index);
    }
    return "";
  }

  /**
   * Render sort indicator
   */
  _renderSortIndicator(column) {
    if (!this.sortable) return "";
    const isSorted = this.sortKey === column.key;
    return html`<span class="sort-indicator ${isSorted ? "active" : ""}"
      >${isSorted ? (this.sortDirection === "asc" ? "▲" : "▼") : "⇅"}</span
    >`;
  }

  /**
   * Render table header
   */
  _renderHeader() {
    const visibleColumns = this.columns.filter((col) => col.visible !== false);
    const hasActions = this.rowActions && this.rowActions.length > 0;

    return html`
      <thead>
        <tr>
          ${this.selectable
            ? html`
                <th class="selection-column">
                  ${this.selectionMode === "multiple"
                    ? html`
                        <input
                          type="checkbox"
                          class="selection-checkbox"
                          .checked=${this.selectedRows.length ===
                            this.data.length && this.data.length > 0}
                          .indeterminate=${this.selectedRows.length > 0 &&
                          this.selectedRows.length < this.data.length}
                          @change=${(e) =>
                            this._handleSelectAll(e.target.checked)}
                          aria-label="Select all rows"
                        />
                      `
                    : ""}
                </th>
              `
            : ""}
          ${visibleColumns.map(
            (col) => html`
              <th
                class="${col.align || ""} ${this.sortable &&
                col.sortable !== false
                  ? "sortable"
                  : ""} ${this.sortKey === col.key ? "sorted" : ""} ${this
                  .responsive && col.mobileHidden
                  ? "mobile-hidden"
                  : ""}"
                @click=${() => this._handleHeaderClick(col)}
                @keydown=${(e) => this._handleHeaderKey(e, col)}
                tabindex="0"
                role="columnheader"
                aria-sort="${this.sortKey === col.key
                  ? this.sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"}"
                title="${col.sortable === false ? "" : "Click to sort"}"
                style="${col.width ? `width:${col.width}` : ""}"
              >
                ${col.label}${this._renderSortIndicator(col)}
              </th>
            `
          )}
          ${hasActions ? html` <th class="actions-column">Actions</th> ` : ""}
        </tr>
      </thead>
    `;
  }

  /**
   * Render table body
   */
  _renderBody() {
    const visibleColumns = this.columns.filter((col) => col.visible !== false);
    const hasActions = this.rowActions && this.rowActions.length > 0;

    if (!this.data || this.data.length === 0) {
      const colspan =
        this.emptyColspan ||
        visibleColumns.length +
          (this.selectable ? 1 : 0) +
          (hasActions ? 1 : 0);
      return html`
        <tbody>
          <tr>
            <td colspan="${colspan}" class="empty-state">
              ${this.emptyMessage}
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody>
        ${this.data.map(
          (row, index) => html`
            <tr
              class="${this._getRowClass(row, index)} ${row._clickable
                ? "clickable"
                : ""} ${this._isRowSelected(row) ? "selected" : ""}"
              @click=${() => row._clickable && this._handleRowClick(row, index)}
            >
              ${this.selectable
                ? html`
                    <td class="selection-column">
                      <input
                        type="checkbox"
                        class="selection-checkbox"
                        .checked=${this._isRowSelected(row)}
                        @change=${(e) =>
                          this._handleRowSelect(row, index, e.target.checked)}
                        aria-label="Select row ${index + 1}"
                      />
                    </td>
                  `
                : ""}
              ${visibleColumns.map((col, colIndex) => {
                const cellContent = this._formatCell(row, col);
                const colspan =
                  row._colspan && colIndex === 0 ? row._colspan : 1;

                // Skip rendering cells that are covered by colspan
                if (row._colspan && colIndex > 0) {
                  return "";
                }

                return html`
                  <td
                    class="${this._getCellClass(row, col)} ${this.responsive &&
                    col.mobileHidden
                      ? "mobile-hidden"
                      : ""}"
                    colspan="${colspan}"
                    style="${col.width ? `width:${col.width}` : ""}"
                  >
                    ${cellContent}
                  </td>
                `;
              })}
              ${hasActions
                ? html`
                    <td class="actions-column">
                      <div class="row-actions">
                        ${this.rowActions.map(
                          (action) => html`
                            <button
                              class="row-action-btn"
                              @click=${(e) => {
                                e.stopPropagation();
                                this._handleRowAction(action, row, index);
                              }}
                              title="${action.label}"
                              aria-label="${action.label} for row ${index + 1}"
                            >
                              ${action.icon || action.label}
                            </button>
                          `
                        )}
                      </div>
                    </td>
                  `
                : ""}
            </tr>
          `
        )}
      </tbody>
    `;
  }

  /**
   * Render table footer
   */
  _renderFooter() {
    if (!this.footer) return "";

    return html`
      <tfoot>
        <tr>
          ${this.footer.cells.map(
            (cell) => html`
              <td
                colspan="${cell.colspan || 1}"
                class="${cell.className || ""} ${cell.align || ""}"
              >
                ${cell.content}
              </td>
            `
          )}
        </tr>
      </tfoot>
    `;
  }

  render() {
    return html`
      <div style="position: relative;">
        <table>
          ${this._renderHeader()} ${this._renderBody()} ${this._renderFooter()}
        </table>
        ${this.loading
          ? html`
              <div class="loading-overlay" role="status" aria-live="polite">
                <div class="loading-spinner" aria-hidden="true"></div>
                <span style="margin-left: var(--space-2);"
                  >${this.loadingMessage}</span
                >
              </div>
            `
          : ""}
      </div>
    `;
  }
}

// Register component as ds-table only
customElements.define("ds-table", DataTable);

export { DataTable };
