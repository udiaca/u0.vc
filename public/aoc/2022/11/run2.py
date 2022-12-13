#!/usr/bin/env python3
# Monkey in the middle, part 2
# https://adventofcode.com/2022/day/11

from functools import reduce
from queue import Queue
from os import path


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    monkeys = []
    # { starting_items: list[int], operation: lambda, test: lambda, test_true: int, test_false: int }
    monkey = None
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue

        prefix_str_items = "Starting items: "
        prefix_op_new = "Operation: new = "
        prefix_div_by = "Test: divisible by"
        prefix_if_true = "If true: throw to monkey "
        prefix_if_false = "If false: throw to monkey "

        if data_line.startswith("Monkey "):
            if monkey:
                monkeys.append(monkey)

            monkey = {
                "items": Queue(),
                "operation": lambda a: a,
                "raw_operation": "",
                "div_test": lambda a: a,
                "div_test_true": -1,
                "div_test_false": -1,
                # inspection count
                "inspect_count": 0,
            }

        elif data_line.startswith(prefix_str_items):
            raw_starting_items = data_line[len(prefix_str_items) :]
            str_starting_items = raw_starting_items.split(", ")
            starting_items = [int(i) for i in str_starting_items]
            for starting_item in starting_items:
                monkey["items"].put(starting_item)

        elif data_line.startswith(prefix_op_new):
            raw_operation = data_line[len(prefix_op_new) :]
            # operation = lambda inp: eval(raw_operation, { "old": inp })
            # monkey["operation"] = operation
            monkey["raw_operation"] = raw_operation

        elif data_line.startswith(prefix_div_by):
            raw_div_test = data_line[len(prefix_div_by) :]
            # div_test = lambda inp: (inp % int(raw_div_test)) == 0
            monkey["div_test"] = int(raw_div_test)

        elif data_line.startswith(prefix_if_true):
            raw_if_true = data_line[len(prefix_if_true) :]
            div_test_true = int(raw_if_true)
            monkey["div_test_true"] = div_test_true

        elif data_line.startswith(prefix_if_false):
            raw_if_false = data_line[len(prefix_if_false) :]
            div_test_false = int(raw_if_false)
            monkey["div_test_false"] = div_test_false

    if monkey:
        monkeys.append(monkey)

    return monkeys


def main():
    monkeys = read_and_parse_input()

    base_div_vals = [monkey["div_test"] for monkey in monkeys]
    base_div = reduce(lambda x, y: x * y, base_div_vals)
    for round in range(10000):
        # print(f"Round {round}:")
        for monkey_idx, monkey in enumerate(monkeys):
            # inspect items
            while not monkey["items"].empty():
                item_worry = monkey["items"].get()
                # print(f"  Monkey inspects an item with a worry level of {item_worry}")
                new_item_worry = eval(monkey["raw_operation"], {"old": item_worry})
                monkey["inspect_count"] += 1

                is_bored = (new_item_worry % monkey["div_test"]) == 0
                # print(
                #     f"    Current worry level divisible by {monkey['div_test']}: {is_bored}"
                # )

                if is_bored:
                    new_monkey = monkey["div_test_true"]
                else:
                    new_monkey = monkey["div_test_false"]

                # instead of div by 3, set as new lcm of all div_test values
                # print(f"    Worry level is {new_item_worry}")
                new_item_worry = new_item_worry % base_div

                # print(
                #     f"    Item with worry {new_item_worry} is thrown to monkey {new_monkey}"
                # )
                monkeys[new_monkey]["items"].put(new_item_worry)

    # after all rounds are finished, display the number of times each monkey inspected things
    inspections = []
    for monkey_idx, monkey in enumerate(monkeys):
        print(f"Monkey {monkey_idx} inspected items {monkey['inspect_count']} times.")
        inspections.append(monkey["inspect_count"])

    inspections.sort(reverse=True)
    print(inspections)
    print(inspections[0] * inspections[1])


if __name__ == "__main__":
    main()
