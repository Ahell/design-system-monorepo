# Layout Components

The design system provides three complementary layout components for different use cases:

## ds-stack

**Purpose:** Vertical layouts (column direction)

**Use when:** You need to stack items vertically with consistent spacing.

```html
<ds-stack gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ds-stack>
```

**Props:**

- `gap`: Spacing between items (none | xs | sm | md | lg | xl | 2xl | 3xl | 1-12)
- `align`: Horizontal alignment (start | center | end | stretch)

---

## ds-inline

**Purpose:** Horizontal layouts (row direction)

**Use when:** You need to arrange items horizontally in a row.

```html
<ds-inline gap="2" align="center" justify="space-between">
  <button>Cancel</button>
  <button>Save</button>
</ds-inline>
```

**Props:**

- `gap`: Spacing between items (none | xs | sm | md | lg | xl | 2xl | 3xl | 1-12)
- `align`: Vertical alignment (start | center | end | stretch | baseline)
- `justify`: Horizontal distribution (start | center | end | space-between | space-around | space-evenly)
- `wrap`: Whether items wrap (true | false)

---

## ds-flex

**Purpose:** Custom flexbox layouts with full control

**Use when:** You need more granular control over flex properties (direction, wrap, grow, shrink, etc.)

```html
<ds-flex
  direction="row"
  gap="4"
  align="center"
  justify="space-between"
  wrap="wrap"
  grow="1"
>
  <div>Flexible item 1</div>
  <div>Flexible item 2</div>
</ds-flex>
```

**Props:**

- `direction`: Flex direction (row | row-reverse | column | column-reverse)
- `gap`: Spacing between items (none | xs | sm | md | lg | xl | 2xl | 3xl | 1-12)
- `align`: Cross-axis alignment (start | center | end | stretch | baseline)
- `justify`: Main-axis distribution (start | center | end | space-between | space-around | space-evenly)
- `wrap`: Flex wrap behavior (nowrap | wrap | wrap-reverse)
- `align-content`: Multi-line cross-axis alignment (start | center | end | stretch | space-between | space-around)
- `basis`: Flex basis for children (0 | auto)
- `grow`: Flex grow for children (0-12)
- `shrink`: Flex shrink for children (0-12)

---

## When to Use Each Component

### Use `ds-stack` when:

- ✅ Creating vertical lists
- ✅ Stacking form fields
- ✅ Building card layouts
- ✅ Simple vertical spacing needs

### Use `ds-inline` when:

- ✅ Creating horizontal button groups
- ✅ Building navigation menus
- ✅ Arranging badges or tags
- ✅ Simple horizontal layouts with wrapping

### Use `ds-flex` when:

- ✅ You need both row AND column direction
- ✅ Children need custom flex-grow/shrink/basis
- ✅ Complex responsive layouts with wrap
- ✅ Reversed directions
- ✅ Multi-line alignment control

---

## Examples

### Button Group (ds-inline)

```html
<ds-inline gap="2">
  <ds-button variant="ghost">Cancel</ds-button>
  <ds-button variant="primary">Save</ds-button>
</ds-inline>
```

### Form Layout (ds-stack)

```html
<ds-stack gap="4">
  <ds-input label="Name" />
  <ds-input label="Email" />
  <ds-button>Submit</ds-button>
</ds-stack>
```

### Responsive Card Grid (ds-flex)

```html
<ds-flex direction="row" gap="4" wrap="wrap" grow="1">
  <ds-card>Card 1</ds-card>
  <ds-card>Card 2</ds-card>
  <ds-card>Card 3</ds-card>
</ds-flex>
```

### Header with Logo and Nav (ds-flex)

```html
<ds-flex direction="row" justify="space-between" align="center" gap="4">
  <img src="logo.svg" alt="Logo" />
  <ds-inline gap="4">
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </ds-inline>
</ds-flex>
```
