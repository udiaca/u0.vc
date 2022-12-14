#!/usr/bin/env python3
# Treetop Tree House
# https://adventofcode.com/2022/day/8

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


def main():
    trees_grid = read_and_parse_input()
    tree_visible = {}

    # determine left <-> right visibility
    for row_idx, row in enumerate(trees_grid):
        # visible from left?
        tallest_left_tree_height = -1
        for col_idx, tree_height in enumerate(row):
            if tree_height > tallest_left_tree_height:
                tree_visible[(row_idx, col_idx)] = True
                # print(f"Visible from left: {(row_idx, col_idx)}")
            tallest_left_tree_height = max(tallest_left_tree_height, tree_height)

        # visible from right?
        tallest_right_tree_height = -1
        for col_idx in range(len(row) - 1, -1, -1):
            tree_height = row[col_idx]
            if tree_height > tallest_right_tree_height:
                tree_visible[(row_idx, col_idx)] = True
                # print(f"Visible from right: {(row_idx, col_idx)}")
            tallest_right_tree_height = max(tallest_right_tree_height, tree_height)

    # determine top <-> bottom visibility
    for col_idx in range(len(trees_grid[0])):
        # visible from top?
        tallest_top_tree_height = -1
        for row_idx in range(len(trees_grid)):
            tree_height = trees_grid[row_idx][col_idx]
            if tree_height > tallest_top_tree_height:
                tree_visible[(row_idx, col_idx)] = True
                # print(f"Visible from top: {(row_idx, col_idx)}")
            tallest_top_tree_height = max(tallest_top_tree_height, tree_height)

        # visible from bottom?
        tallest_bottom_tree_height = -1
        for row_idx in range(len(trees_grid) - 1, -1, -1):
            tree_height = trees_grid[row_idx][col_idx]
            if tree_height > tallest_bottom_tree_height:
                tree_visible[(row_idx, col_idx)] = True
                # print(f"Visible from bottom: {(row_idx, col_idx)}")
            tallest_bottom_tree_height = max(tallest_bottom_tree_height, tree_height)

    print(tree_visible)
    print(len(tree_visible.keys()))

if __name__ == "__main__":
    main()
