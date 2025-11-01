/**
 * Design System - Stat Card Component
 *
 * Enhanced statistic display card with professional styling using design tokens.
 * Perfect for dashboard stats, key metrics, and summary data with trend indicators.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

export class DSStatCard extends LitElement {
  static properties = {
    label: { type: String, reflect: true },
    value: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    trend: { type: String, reflect: true },
    change: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    .stat-card {
      display: inline-flex;
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--color-surface-primary);
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-md);
      min-width: 120px;
      transition: var(--transition-all);
      box-shadow: var(--shadow-sm);
    }

    .stat-card:hover {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .stat-icon {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    .stat-trend {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      padding: 2px var(--space-1);
      border-radius: var(--radius-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-trend.up {
      color: var(--color-success-main);
      background: var(--color-success-bg);
    }

    .stat-trend.down {
      color: var(--color-error-main);
      background: var(--color-error-bg);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .stat-label {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: var(--leading-tight);
    }

    .stat-value {
      color: var(--color-text-primary);
      font-weight: var(--weight-bold);
      font-variant-numeric: tabular-nums;
      font-family: var(--font-mono);
      font-size: var(--text-2xl);
      line-height: var(--leading-tight);
    }

    .stat-change {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      font-variant-numeric: tabular-nums;
    }

    .stat-change.positive {
      color: var(--color-success-main);
    }

    .stat-change.negative {
      color: var(--color-error-main);
    }

    /* Variant styles */
    .stat-card.variant-primary {
      border-color: var(--color-primary-main);
      background: var(--color-primary-bg);
    }

    .stat-card.variant-success {
      border-color: var(--color-success-main);
      background: var(--color-success-bg);
    }

    .stat-card.variant-warning {
      border-color: var(--color-warning-main);
      background: var(--color-warning-bg);
    }

    .stat-card.variant-danger {
      border-color: var(--color-error-main);
      background: var(--color-error-bg);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .stat-card {
        padding: var(--space-3);
        min-width: 100px;
      }

      .stat-value {
        font-size: var(--text-xl);
      }

      .stat-label {
        font-size: var(--text-xs);
      }
    }
  `;

  constructor() {
    super();
    this.label = "";
    this.value = "—";
    this.icon = "";
    this.trend = ""; // 'up', 'down', or ''
    this.change = "";
    this.variant = "default";
  }

  render() {
    const trendClass = this.trend ? `stat-trend ${this.trend}` : "";
    const changeClass = this.change
      ? `stat-change ${this.change.startsWith("+") ? "positive" : "negative"}`
      : "";

    return html`
      <div class="stat-card variant-${this.variant}">
        <div class="stat-header">
          ${this.icon ? html`<span class="stat-icon">${this.icon}</span>` : ""}
          ${this.trend
            ? html`<span class="${trendClass}">${this.trend}</span>`
            : ""}
        </div>

        <div class="stat-content">
          <div class="stat-label">${this.label}</div>
          <div class="stat-value">${this.value}</div>
          ${this.change
            ? html`<div class="${changeClass}">${this.change}</div>`
            : ""}
        </div>
      </div>
    `;
  }
}

// Register component
customElements.define("ds-stat-card", DSStatCard);
