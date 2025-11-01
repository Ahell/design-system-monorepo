/**
 * Lit Table Components
 * Pure JavaScript implementation using Lit 3 from CDN
 *
 * Component:
 * - DataTable: Flexible data table with columns, formatters, sorting, and actions
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";

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
    sortKey: { type: String, attribute: "sort-key" },
    sortDirection: { type: String, attribute: "sort-direction" },
    rowClassName: { type: Function },
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
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-surface-primary);
      border: var(--border-width-thin) solid var(--color-border-primary);
      box-shadow: var(--shadow-sm);
      transition: var(--transition-all);
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
    this.sortKey = "";
    this.sortDirection = "asc";
    this.rowClassName = null;
  }

  /**
   * Handle column header click for sorting
   */
  _handleHeaderClick(column) {
    if (!this.sortable) return;

    let newDirection = "asc";
    if (this.sortKey === column.key) {
      newDirection = this.sortDirection === "asc" ? "desc" : "asc";
    }

    this.sortKey = column.key;
    this.sortDirection = newDirection;

    this.dispatchEvent(
      new CustomEvent("sort-change", {
        detail: { key: column.key, direction: newDirection },
        bubbles: true,
        composed: true,
      })
    );
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
   * Returns either a string (for unsafeHTML) or a Lit template
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
   * Check if a value is a Lit template result
   */
  _isTemplateResult(value) {
    return value && typeof value === "object" && "_$litType$" in value;
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
    return html`
      <thead>
        <tr>
          ${visibleColumns.map(
            (col) => html`
              <th
                class="${col.align || ""} ${this.sortable
                  ? "sortable"
                  : ""} ${this.sortKey === col.key ? "sorted" : ""}"
                @click=${() => this._handleHeaderClick(col)}
              >
                ${col.label}${this._renderSortIndicator(col)}
              </th>
            `
          )}
        </tr>
      </thead>
    `;
  }

  /**
   * Render table body
   */
  _renderBody() {
    const visibleColumns = this.columns.filter((col) => col.visible !== false);
    if (!this.data || this.data.length === 0) {
      const colspan = this.emptyColspan || visibleColumns.length;
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
                : ""}"
              @click=${() => row._clickable && this._handleRowClick(row, index)}
            >
              ${visibleColumns.map((col, colIndex) => {
                const cellContent = this._formatCell(row, col);
                const isTemplate = this._isTemplateResult(cellContent);
                const colspan =
                  row._colspan && colIndex === 0 ? row._colspan : 1;

                // Skip rendering cells that are covered by colspan
                if (row._colspan && colIndex > 0) {
                  return "";
                }

                return html`
                  <td
                    class="${this._getCellClass(row, col)}"
                    colspan="${colspan}"
                  >
                    ${isTemplate
                      ? cellContent
                      : unsafeHTML(String(cellContent))}
                  </td>
                `;
              })}
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
      <table>
        ${this._renderHeader()} ${this._renderBody()} ${this._renderFooter()}
      </table>
    `;
  }
}

// Register component as ds-table only
customElements.define("ds-table", DataTable);

export { DataTable };
