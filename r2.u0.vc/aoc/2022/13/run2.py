#!/usr/bin/env python3
# Distress Signal, part 2
# https://adventofcode.com/2022/day/13

from copy import deepcopy
from functools import cmp_to_key
from os import path


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    lines = []
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue
        line = eval(data_line)
        lines.append(recursive_reverse(line))

    return lines


def recursive_reverse(items):
    if isinstance(items, list):
        return [recursive_reverse(item) for item in reversed(items)]
    return items


def pair_cmp(base_left_stack, base_right_stack):
    """
    -1 if left < right, 1 if left > right, 0 if equal.
    """

    left_stack = deepcopy(base_left_stack)
    right_stack = deepcopy(base_right_stack)

    # compare the two stacks now
    while True:
        try:
            left = left_stack.pop()
        except IndexError:
            left = None
        try:
            right = right_stack.pop()
        except IndexError:
            right = None

        if left is None and right is None:
            return 0
        elif left is None:
            return -1
        elif right is None:
            return 1

        left_is_int = isinstance(left, int)
        right_is_int = isinstance(right, int)
        left_is_list = isinstance(left, list)
        right_is_list = isinstance(right, list)

        if left_is_int and right_is_int:
            # both are ints, just compare
            if left < right:
                return -1
            elif left > right:
                return 1
            else:
                continue
        elif left_is_int and right_is_list:
            # left is an int and right is a list.
            # convert int to list and retry comparison
            left_stack.append([left])
            right_stack.append(right)
            continue
        elif left_is_list and right_is_int:
            # right is an int and left is a list.
            # convert int to list and retry comparison
            left_stack.append(left)
            right_stack.append([right])
            continue
        elif left_is_list and right_is_list:
            # both are lists, recurse
            list_cmp_result = pair_cmp(left, right)
            if list_cmp_result != 0:
                return list_cmp_result


def main():
    lines = read_and_parse_input()
    # add two additional divider packets
    lines.append([[6]])
    lines.append([[2]])
    # for line in lines:
    #     print(line)
    # print("====\n")

    sorted_lines = sorted(lines, key=cmp_to_key(pair_cmp))

    for line in sorted_lines:
        print(line)

    div_two_index = sorted_lines.index([[2]]) + 1
    div_six_index = sorted_lines.index([[6]]) + 1
    print(div_two_index, div_six_index)
    print(div_two_index * div_six_index)


if __name__ == "__main__":
    main()
