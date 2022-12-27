---
layout: ../../../layouts/MarkdownLayout.astro
title: "Code Style"
description: "Examples of good style, bad style"
---

# Code Style Guidelines

Order of personal importance/preference.

1. `supported` > `indie` / `hobbyist` / `hacker`

    Prioritize code that is maintained by more individuals.

1. `explainable code` >>> `inexplicable code`*

    Code should be straightforward for a generalist to grok.

1. `less code` > `more code`*

    Use the least amount of code to accomplish tasks.

1. `faster` >> `slower`.

    Accomplish tasks as fast as possible.

1. `less memory` > `more memory`

    Accomplish tasks as efficiently as possible.

1. `types` >> `untyped`**

    Limit the amount of `any` used within TypeScript.

1. `functional` >>> `object oriented`

    Try to use `map` with callbacks. Try to reduce using `class` definitions.

1. `memory safe` > `use after free` vulnerable

1. `minimize dependencies` >>> `huge package.json and node_modules`

    Whenever possible, rely on existing APIs, not build-time libraries. 

```
(*) Automated processes can compile/transpile code.
(**) In dynamically typed languages, try to use type hints.
```

# Examples

## Actions Per Line

Impacts:

* `explainable code` >>> `inexplicable code`
* `less code` > `more code`

Try to maintain a maximum of 2 'tasks' per line of code.

```python
def get_domains(props):
    for I in set([props[o]]+props.get('SubjectAlternativeNames',[])):print(I)
```

Unrolling this out makes the example far more readable.

```python
def get_domains(props):
    # make an iterable copy of domain names with alternative names
    list_certs = [props['DomainName']] + props.get('SubjectAlternativeNames', [])
    # remove any duplicates
    set_certs = set(list_certs)

    # print out each name in a new line
    for name in set_certs:
        print(name)
```

## Unbalanced `IF` Body

Impacts:

* `explainable code` >>> `inexplicable code`


Reduce nested code where possible.

```python
def fancy_no_mod3r1(num):
    if num % 3 == 1:
        # this is the collatz_conjecture
        sequence = [num]
        while (num != 1):
            if (num % 2) == 0:
                num = num // 2
            else:
                num = (num * 3) + 1
            sequence.append(num)
        return sequence[-1] == 1

    return False
```

By moving `return False` into the conditional block first, we save on the amount of whitespace.

```python
def fancy_no_mod3r1(num):
    if num % 3 != 1:
        return False

    # this is the collatz_conjecture
    sequence = [num]
    while (num != 1):
        if (num % 2) == 0:
            num = num // 2
        else:
            num = (num * 3) + 1
        sequence.append(num)
    return sequence[-1] == 1
```
