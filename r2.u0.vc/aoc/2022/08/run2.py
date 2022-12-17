#!/usr/bin/env python3
# Treetop Tree House, part 2
# https://adventofcode.com/2022/day/8

from functools import cache
from os import path


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    trees = []
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue
        trees.append(tuple([int(tree) for tree in data_line]))
    return tuple(trees)


@cache
def calc_visibility(row_col_idx, direction, trees_grid, cur_tree_height=None):
    row_idx, col_idx = row_col_idx
    if cur_tree_height is None:
        cur_tree_height = trees_grid[row_idx][col_idx]

    if direction == "L":
        # determine visibility to left
        left_tree_idx = col_idx - 1
        if left_tree_idx < 0:
            return 0
        left_tree_height = trees_grid[row_idx][left_tree_idx]
        if left_tree_height >= cur_tree_height:
            return 1
        return 1 + calc_visibility((row_idx, left_tree_idx), direction, trees_grid, cur_tree_height=cur_tree_height)

    elif direction == "R":
        # determine visibility to right
        right_tree_idx = col_idx + 1
        if right_tree_idx >= len(trees_grid[0]):
            return 0
        right_tree_height = trees_grid[row_idx][right_tree_idx]
        if right_tree_height >= cur_tree_height:
            return 1
        return 1 + calc_visibility((row_idx, right_tree_idx), direction, trees_grid, cur_tree_height=cur_tree_height)

    elif direction == "U":
        # determine visibility to up
        up_tree_idx = row_idx - 1
        if up_tree_idx < 0:
            return 0
        up_tree_height = trees_grid[up_tree_idx][col_idx]
        if up_tree_height >= cur_tree_height:
            return 1
        return 1 + calc_visibility((up_tree_idx, col_idx), direction, trees_grid, cur_tree_height=cur_tree_height)

    elif direction == "D":
        # determine visibility to down
        down_tree_idx = row_idx + 1
        if down_tree_idx >= len(trees_grid):
            return 0
        down_tree_height = trees_grid[down_tree_idx][col_idx]
        if down_tree_height >= cur_tree_height:
            return 1
        return 1 + calc_visibility((down_tree_idx, col_idx), direction, trees_grid, cur_tree_height=cur_tree_height)


def main():
    trees_grid = read_and_parse_input()

    position = (0, 0)
    position_score = -1

    for row_idx, row in enumerate(trees_grid):
        for col_idx, tree_height in enumerate(row):
            left_visibility = calc_visibility((row_idx, col_idx), "L", trees_grid, cur_tree_height=tree_height)
            right_visibility = calc_visibility((row_idx, col_idx), "R", trees_grid, cur_tree_height=tree_height)
            up_visibility = calc_visibility((row_idx, col_idx), "U", trees_grid, cur_tree_height=tree_height)
            down_visibility = calc_visibility((row_idx, col_idx), "D", trees_grid, cur_tree_height=tree_height)

            cur_position = (row_idx, col_idx)
            cur_score = left_visibility * right_visibility * up_visibility * down_visibility
            if cur_score > position_score:
                print(f"update best position: {cur_position}, score: {cur_score}")
                print([left_visibility, right_visibility, up_visibility, down_visibility])
                position = cur_position
                position_score = cur_score

    print(position, position_score)

if __name__ == "__main__":
    main()
