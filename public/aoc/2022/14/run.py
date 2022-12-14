#!/usr/bin/env python3
# Regolith Reservoir
# https://adventofcode.com/2022/day/14

from os import path


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # origin (0, 0) is top left
    # just use a dictionary, if fallback get return '.'
    grid = {}

    for data_line in data_lines:
        data_line = data_line.strip()
        raw_line_points = data_line.split(" -> ")

        prev_position = None
        for raw_line_point in raw_line_points:
            position = tuple([int(val) for val in raw_line_point.split(",")])
            if prev_position is None:
                grid[position] = "#"
                prev_position = position
                continue

            # fill in the rest of the grid positions from previous point
            delta = [v[0]-v[1] for v in zip(position, prev_position)]

            prev_move_down_amt = delta[1]
            prev_move_right_amount = delta[0]

            line_len = 1
            while prev_move_down_amt > 0:
                # wall moving down
                wall_pos = (prev_position[0], prev_position[1] + line_len)
                grid[wall_pos] = "#"
                line_len += 1
                prev_move_down_amt -= 1

            line_len = 1
            while prev_move_down_amt < 0:
                # wall moving up
                wall_pos = (prev_position[0], prev_position[1] - line_len)
                grid[wall_pos] = "#"
                line_len += 1
                prev_move_down_amt += 1

            line_len = 1
            while prev_move_right_amount > 0:
                # wall moving right
                wall_pos = (prev_position[0] + line_len, prev_position[1])
                grid[wall_pos] = "#"
                line_len += 1
                prev_move_right_amount -= 1

            line_len = 1
            while prev_move_right_amount < 0:
                # wall moving right
                wall_pos = (prev_position[0] - line_len, prev_position[1])
                grid[wall_pos] = "#"
                line_len += 1
                prev_move_right_amount += 1

            grid[position] = "#"
            prev_position = position

    return grid



def main():
    grid = read_and_parse_input()
    max_y = max([key[1] for key in grid.keys()])

    # print(grid, max_y)

    placed_sand = 0
    # try to place falling sand, starting from (500, 0)
    cur_sand = (500, 0)
    while cur_sand[1] <= max_y:
        below_sand = grid.get((cur_sand[0], cur_sand[1] + 1), '.')
        left_below_sand = grid.get((cur_sand[0] - 1, cur_sand[1] + 1), '.')
        right_below_sand = grid.get((cur_sand[0] + 1, cur_sand[1] + 1), '.')

        if below_sand == '.':
            # empty space, move cur_sand down one
            cur_sand = (cur_sand[0], cur_sand[1] + 1)
            continue
        elif left_below_sand == '.':
            cur_sand = (cur_sand[0] - 1, cur_sand[1] + 1)
        elif right_below_sand == '.':
            cur_sand = (cur_sand[0] + 1, cur_sand[1] + 1)
        else:
            # sand is stuck at current position
            grid[cur_sand] = 'o'
            cur_sand = (500, 0)
            placed_sand += 1

    print(placed_sand)


if __name__ == "__main__":
    main()
