// Feature Data: contact
// Contact page configuration and content data

export const CONTACT_CONFIG = {
  title: "Get in Touch",
  subtitle: "Ready to bring your story to life? We'd love to hear from you.",
  persons: [
    {
      name: "Dylan Williams",
      role: "Producer and Director for the international market",
      email: "dylan@backflipmedia.se",
      phone: "+46 (0)70 486 01 28",
    },
    {
      name: "Emil Engerdahl",
      role: "Documentary Showrunner and Story Producer",
      email: "emil@backflipmedia.se",
      phone: "+46 (0)70 557 19 81",
    },
  ],
};

export function getContactConfig() {
  return CONTACT_CONFIG;
}

export function getContactContent() {
  return {
    title: CONTACT_CONFIG.title,
    subtitle: CONTACT_CONFIG.subtitle,
    persons: CONTACT_CONFIG.persons,
  };
}
