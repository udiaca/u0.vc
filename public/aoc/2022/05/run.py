#!/usr/bin/env python3
# Supply Stacks
# https://adventofcode.com/2022/day/5

from os import path
from collections import namedtuple

Action = namedtuple("Action", ["amount", "from_val", "to_val"])


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    stacks = {}
    actions = []

    prefix_move = "move "
    prefix_ids = " 1   2"

    for data_line in data_lines:
        if data_line == "\n":
            continue
        elif data_line.startswith(prefix_ids):
            continue
        elif data_line.startswith(prefix_move):
            data_line = data_line.strip()
            raw_line = data_line[len(prefix_move) :]
            amount_str, _, from_str, _, to_str = raw_line.split()
            actions.append(Action(int(amount_str), int(from_str) - 1, int(to_str) - 1))
        else:
            # is a stack
            data_line = data_line.rstrip("\n")

            search_start = 0
            stack_start_idx = data_line.index("[", search_start)

            while stack_start_idx >= 0:
                letter_idx = stack_start_idx + 1
                letter = data_line[stack_start_idx + 1]
                stack_idx = letter_idx // 4

                stack = stacks.get(stack_idx, [])
                stack.append(letter)
                stacks[stack_idx] = stack

                search_start = stack_start_idx
                try:
                    stack_start_idx = data_line.index("[", search_start + 1)
                except ValueError:
                    break

    # reverse all for appropriate stack order
    for key, value in stacks.items():
        stacks[key].reverse()

    return stacks, actions


def print_stacks(stacks):
    for stack_idx in range(len(stacks.keys())):
        stack = stacks[stack_idx]
        print(f"{stack_idx}: ", stack)


def main():
    stacks, actions = read_and_parse_input()

    for action in actions:
        print(f"before {action}")
        print_stacks(stacks)
        for _ in range(action.amount):
            entity = stacks[action.from_val].pop()
            stacks[action.to_val].append(entity)
        print(f"after {action}")
        print_stacks(stacks)

    top = []
    for stack_idx in range(len(stacks.keys())):
        stack = stacks[stack_idx]
        top.append(stack[-1])
    print("".join(top))


if __name__ == "__main__":
    main()
