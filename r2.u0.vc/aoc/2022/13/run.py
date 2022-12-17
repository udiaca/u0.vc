#!/usr/bin/env python3
# Distress Signal
# https://adventofcode.com/2022/day/13

from os import path


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    line_pairs = []
    line_pair = []
    for data_line in data_lines:
        data_line = data_line.strip()
        if data_line:
            line = eval(data_line)
            line_pair.append(recursive_reverse(line))
        else:
            line_pairs.append(tuple(line_pair))
            line_pair = []

    if len(line_pair) == 2:
        line_pairs.append(tuple(line_pair))
    return line_pairs


def recursive_reverse(items):
    if isinstance(items, list):
        return [recursive_reverse(item) for item in reversed(items)]
    return items


def pair_cmp(left_stack, right_stack):
    """
    1 if left < right, -1 if left > right, 0 if equal.
    """
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
            return 1
        elif right is None:
            return -1

        left_is_int = isinstance(left, int)
        right_is_int = isinstance(right, int)
        left_is_list = isinstance(left, list)
        right_is_list = isinstance(right, list)

        if left_is_int and right_is_int:
            # both are ints, just compare
            if left < right:
                return 1
            elif left > right:
                return -1
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
    line_pairs = read_and_parse_input()
    valid_indicies = []
    for line_idx, line_pair in enumerate(line_pairs, 1):
        left_val, right_val = line_pair
        cmp_result = pair_cmp(left_val, right_val)

        if cmp_result == 1:
            valid_indicies.append(line_idx)

    print(valid_indicies)
    print(sum(valid_indicies))


if __name__ == "__main__":
    main()
