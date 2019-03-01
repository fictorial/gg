# Addressing Values in Markdown with Keypaths

A **keypath** addresses a *value* in a Markdown file.

Here is an example Markdown file, keypaths, and corresponding values.

```markdown
# User

## Name

Brian

## Home Address

### Street

555 Main St

### City

Anywhere

### State

NY

## Likes

- food
- water
- farming
- exercise
- pina coladas

```

keypath                        | value
-------------------------------|--------------------------
`User > Name`                  | `Brian`
`User > Home Address > Street` | `555 Main St`
`User > Likes > [0]`           | `food`
`User > Likes > [3]`           | `exercise`
`User > Likes > [-1]`          | `pina coladas`
`User > Likes > [-2]`          | `exercise`

Notes:

- Nested lists are not supported
- Don't use `>` in your Markdown headers :-)

