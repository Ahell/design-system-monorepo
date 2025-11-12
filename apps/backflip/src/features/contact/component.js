// Feature Component: contact
// Contact page component that mimics homepage layout with contact information

import { LitElement, html, css } from "lit";
import { getContactContent } from "./data.js";
import { initializeContact } from "./logic.js";

export class BackflipContact extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      height: 100vh;
      width: 100%;
      background-color: var(--color-bright-gold);
    }

    .menu-container {
      grid-row: 1;
      grid-column: 2;
      display: flex;
      justify-content: flex-end;
      padding: var(--space-4) 0;
    }

    .content-container {
      grid-row: 2;
      grid-column: 2;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
      gap: var(--space-6);
      max-width: 800px;
    }

    .contact-title {
      font-size: var(--text-6xl);
      font-weight: var(--weight-black);
      font-family: var(--font-display);
      margin: 0;
      letter-spacing: var(--tracking-tight);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    .contact-subtitle {
      font-size: var(--text-2xl);
      font-weight: var(--weight-medium);
      font-family: var(--font-serif);
      margin: 0;
      letter-spacing: var(--tracking-normal);
      line-height: 1.3;
      color: var(--color-text-secondary);
      max-width: 600px;
    }

    .persons-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      width: 100%;
      margin-bottom: var(--space-6);
    }

    .person-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .person-name {
      font-size: var(--text-xl);
      font-weight: var(--weight-bold);
      font-family: var(--font-display);
      margin: 0;
      color: var(--color-text-primary);
    }

    .person-role {
      font-size: var(--text-base);
      font-weight: var(--weight-medium);
      font-family: var(--font-sans);
      margin: 0 0 var(--space-3) 0;
      color: var(--color-text-secondary);
    }

    .person-contact {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .person-email,
    .person-phone {
      font-size: var(--text-sm);
      font-weight: var(--weight-normal);
      font-family: var(--font-sans);
      margin: 0;
      color: var(--color-text-secondary);
    }

    .footer-container {
      grid-row: 3;
      grid-column: 2;
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeContact();
  }

  render() {
    const content = getContactContent();

    return html`
      <div class="contact-grid">
        <div class="menu-container"></div>
        <div class="content-container">
          <h1 class="contact-title">${content.title}</h1>
          <p class="contact-subtitle">${content.subtitle}</p>
          <div class="persons-section">
            ${content.persons.map(
              (person) => html`
                <div class="person-item">
                  <h2 class="person-name">${person.name}</h2>
                  <p class="person-role">${person.role}</p>
                  <div class="person-contact">
                    <p class="person-email">${person.email}</p>
                    <p class="person-phone">${person.phone}</p>
                  </div>
                </div>
              `
            )}
          </div>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define("backflip-contact", BackflipContact);
